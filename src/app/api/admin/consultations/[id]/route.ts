import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongoose";
import Consultation from "@/lib/models/Consultation";
import { requireAccess } from "@/lib/requireAccess";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ALLOWED_STATUSES = [
  "new",
  "reviewing",
  "booked",
  "completed",
  "cancelled",
] as const;

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  await requireAccess("admin");

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid consultation ID" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const status = body?.status;

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Invalid consultation status" },
      { status: 400 }
    );
  }

  await dbConnect();

  const updated = await Consultation.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json(
      { error: "Consultation not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ consultation: updated });
}