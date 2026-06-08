import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import { authOptions } from "@/lib/authOptions";
import Consultation from "@/lib/models/Consultation";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const consultations = await Consultation.find({
      $or: [
        { email: session.user.email.toLowerCase() },
        ...(session.user.id ? [{ user: session.user.id }] : []),
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ consultations });
  } catch (error) {
    console.error("GET /api/consultations/my error:", error);
    return NextResponse.json(
      { error: "Failed to load consultations" },
      { status: 500 }
    );
  }
}