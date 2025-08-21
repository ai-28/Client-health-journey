import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db/postgresql";

export async function GET(request, { params }) {
    try {
        const { clinicId } = params;

        if (!clinicId) {
            return NextResponse.json(
                { success: false, message: 'Clinic ID is required' },
                { status: 400 }
            );
        }

        // Get clinic logo URL
        const result = await sql`
            SELECT "logoUrl" 
            FROM "Clinic" 
            WHERE "id" = ${clinicId}
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Clinic not found' },
                { status: 404 }
            );
        }

        const logoUrl = result[0].logoUrl;

        return NextResponse.json({
            success: true,
            logoUrl: logoUrl
        });

    } catch (error) {
        console.error('Get clinic logo error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to get clinic logo"
        }, { status: 500 });
    }
}
