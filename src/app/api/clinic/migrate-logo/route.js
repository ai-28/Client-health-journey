import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db/postgresql";

export async function POST() {
    try {
        console.log("Starting logo migration...");

        // Add logoUrl column to Clinic table if it doesn't exist
        await sql`
            ALTER TABLE "Clinic" 
            ADD COLUMN IF NOT EXISTS "logoUrl" VARCHAR(500)
        `;

        console.log("Logo migration completed successfully");

        return NextResponse.json({
            success: true,
            message: 'Migration completed successfully. logoUrl field added to Clinic table.'
        });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to run migration"
        }, { status: 500 });
    }
}
