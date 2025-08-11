import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;

    try {
        const trendData = await clientRepo.getTrendData(email);
        return NextResponse.json({ status: true, trendData });
    } catch (error) {
        console.error("Error fetching trend data:", error);
        return NextResponse.json({
            status: false,
            message: error.message || "An error occurred while fetching trend data"
        });
    }
}
