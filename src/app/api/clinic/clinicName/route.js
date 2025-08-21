import { NextResponse } from "next/server";
import { clinicRepo } from "@/app/lib/db/clinicRepo";

export async function POST(request) {
    const { clinicId} = await request.json();
    try {
      const clinicName = await clinicRepo.getClinicName(clinicId);
  
      return NextResponse.json({ status: true, clinicName });
    } catch (error) {
      return NextResponse.json({ status: false, message: error.message });
    }
  }