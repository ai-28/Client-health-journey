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
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Check if user is clinic admin
        if (session.user.role !== "clinic_admin") {
            return NextResponse.json({ message: "Unauthorized - Clinic admin only" }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('logo');
        const clinicId = formData.get('clinicId');

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No logo file provided' },
                { status: 400 }
            );
        }

        if (!clinicId) {
            return NextResponse.json(
                { success: false, message: 'Clinic ID is required' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, message: 'Only JPEG, PNG, and WebP images are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, message: 'Logo file size must be less than 5MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `clinic-${clinicId}-logo-${uuidv4()}.${fileExtension}`;
        const filePath = `logos/${fileName}`;

        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        // Upload to DigitalOcean Spaces
        const command = new PutObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: filePath,
            Body: fileBuffer,
            ContentType: file.type,
            ACL: 'public-read',
            ContentLength: file.size,
            CacheControl: 'max-age=31536000', // Cache for 1 year
        });

        await s3Client.send(command);
        const logoUrl = getCdnUrl(filePath);

        // Update clinic record with new logo URL
        await sql`
            UPDATE "Clinic" 
            SET "logoUrl" = ${logoUrl}, "updatedAt" = NOW()
            WHERE "id" = ${clinicId}
        `;

        return NextResponse.json({
            success: true,
            message: 'Logo uploaded successfully',
            logoUrl: logoUrl
        });

    } catch (error) {
        console.error('Logo upload error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to upload logo"
        }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Check if user is clinic admin
        if (session.user.role !== "clinic_admin") {
            return NextResponse.json({ message: "Unauthorized - Clinic admin only" }, { status: 403 });
        }

        const { clinicId } = await request.json();

        if (!clinicId) {
            return NextResponse.json(
                { success: false, message: 'Clinic ID is required' },
                { status: 400 }
            );
        }

        // Remove logo URL from clinic record
        await sql`
            UPDATE "Clinic" 
            SET "logoUrl" = NULL, "updatedAt" = NOW()
            WHERE "id" = ${clinicId}
        `;

        return NextResponse.json({
            success: true,
            message: 'Logo removed successfully'
        });

    } catch (error) {
        console.error('Logo removal error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to remove logo"
        }, { status: 500 });
    }
}
