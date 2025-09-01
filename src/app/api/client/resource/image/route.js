import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { sql } from "@/app/lib/db/postgresql";

// Initialize S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
    endpoint: `https://${process.env.DO_SPACES_REGION}.${process.env.DO_SPACES_ENDPOINT}`,
    region: process.env.DO_SPACES_REGION,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
    },
    forcePathStyle: true,
});

// Helper function to generate CDN URL
const getCdnUrl = (filePath) => {
    if (process.env.DO_SPACES_CDN_ENABLED === 'true') {
        return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.cdn.${process.env.DO_SPACES_ENDPOINT}/${filePath}`;
    }
    return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.${process.env.DO_SPACES_ENDPOINT}/${filePath}`;
};

export async function POST(request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: false,
                message: "Unauthorized - Please log in"
            }, { status: 401 });
        }

        // Check if user has permission to upload images
        const userRole = session.user?.role;
        if (!userRole || !['client', 'coach', 'clinic_admin', 'admin'].includes(userRole)) {
            return NextResponse.json({
                status: false,
                message: "Access denied - Insufficient permissions"
            }, { status: 403 });
        }

        // Parse form data
        let formData;
        try {
            formData = await request.formData();
        } catch (error) {
            return NextResponse.json({
                status: false,
                message: "Invalid form data"
            }, { status: 400 });
        }

        const file = formData.get('image');
        let description = formData.get('description') || "";
        let date = formData.get('date') || new Date();

        // Ensure date is properly formatted
        if (typeof date === 'string') {
            try {
                date = new Date(date).toISOString();
            } catch (error) {
                date = new Date().toISOString();
            }
        } else {
            date = date.toISOString();
        }

        // Sanitize description to prevent validation issues
        description = description.replace(/[<>]/g, '').trim();

        // Debug: Log the received data
        console.log("Received upload data:", {
            fileName: file?.name,
            fileSize: file?.size,
            fileType: file?.type,
            description: description,
            date: date
        });

        // Validate file
        if (!file) {
            return NextResponse.json({
                status: false,
                message: 'No image file provided'
            }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({
                status: false,
                message: 'File must be an image'
            }, { status: 400 });
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({
                status: false,
                message: 'Image file too large. Maximum size is 10MB'
            }, { status: 400 });
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!allowedExtensions.includes(fileExtension)) {
            return NextResponse.json({
                status: false,
                message: 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP'
            }, { status: 400 });
        }

        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `images/${fileName}`;

        // Convert file to buffer
        let fileBuffer;
        try {
            const buffer = await file.arrayBuffer();
            fileBuffer = Buffer.from(buffer);
        } catch (error) {
            return NextResponse.json({
                status: false,
                message: 'Failed to process image file'
            }, { status: 400 });
        }

        // Upload to DigitalOcean Spaces
        try {
            const command = new PutObjectCommand({
                Bucket: process.env.DO_SPACES_BUCKET,
                Key: filePath,
                Body: fileBuffer,
                ContentType: file.type,
                ACL: 'public-read',
                ContentLength: file.size,
                CacheControl: 'max-age=31536000',
            });

            await s3Client.send(command);
        } catch (s3Error) {
            console.error('S3 upload error:', s3Error);
            return NextResponse.json({
                status: false,
                message: 'Failed to upload image to storage'
            }, { status: 500 });
        }

        const url = getCdnUrl(filePath);

        // Save to database
        try {
            await sql`
                INSERT INTO "SelfieImage" ("email", "image", "description", "date") 
                VALUES (${session.user.email}, ${url}, ${description}, ${date})
            `;
        } catch (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json({
                status: false,
                message: 'Failed to save image record'
            }, { status: 500 });
        }

        return NextResponse.json({
            status: true,
            url,
            description,
            date
        });

    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json({
            status: false,
            message: "An unexpected error occurred while uploading the image"
        }, { status: 500 });
    }
}
