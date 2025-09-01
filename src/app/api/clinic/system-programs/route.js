import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sessionEmail = session.user.email;
    const sessionUser = await userRepo.getUserByEmail(sessionEmail);
    if (!sessionUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (sessionUser.role !== "clinic_admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const clinicId = sessionUser.clinic;

    try {
        // Get all system admin programs and check which ones the clinic has access to
        const programs = await programRepo.getSystemAdminProgramsWithClinicAccess(clinicId);
        return NextResponse.json({ status: true, programs });
    } catch (error) {
        console.error("Error fetching system programs:", error);
        return NextResponse.json({ status: false, message: "Failed to fetch programs" }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sessionEmail = session.user.email;
    const sessionUser = await userRepo.getUserByEmail(sessionEmail);
    if (!sessionUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (sessionUser.role !== "clinic_admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const clinicId = sessionUser.clinic;
    const { programId, action } = await request.json();

    if (!programId || !action) {
        return NextResponse.json({ status: false, message: "Missing required fields" }, { status: 400 });
    }

    try {
        let result;

        if (action === "add") {
            result = await programRepo.addClinicToProgramAccess(programId, clinicId);
        } else if (action === "remove") {
            result = await programRepo.removeClinicFromProgramAccess(programId, clinicId);
        } else {
            return NextResponse.json({ status: false, message: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({
            status: true,
            message: `Program ${action === 'add' ? 'enabled for' : 'disabled for'} clinic successfully`,
            program: result
        });
    } catch (error) {
        console.error(`Error ${action}ing clinic access to program:`, error);
        return NextResponse.json({
            status: false,
            message: `Failed to ${action} program access for clinic`
        }, { status: 500 });
    }
}
