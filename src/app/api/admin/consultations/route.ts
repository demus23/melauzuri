import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import { authOptions } from "@/lib/authOptions";
import Consultation from "@/lib/models/Consultation";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const consultations = await Consultation.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ consultations });
  } catch (error) {
    console.error("GET /api/admin/consultations error:", error);
    return NextResponse.json(
      { error: "Failed to load admin consultations" },
      { status: 500 }
    );
  }
}