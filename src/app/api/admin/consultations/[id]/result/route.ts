import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
import dbConnect from "@/lib/mongoose";
import ConsultationCase from "@/lib/models/ConsultationCase";
import { requireAccess } from "@/lib/requireAccess";
import { sendEmail } from "@/lib/email";
import { resultsReadyEmail } from "@/lib/emailTemplates";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteContext) {
  try {
    await requireAccess("admin");
    await dbConnect();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid consultation ID" }, { status: 400 });
    }

    const formData = await req.formData();

    const consultation = await ConsultationCase.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
          result: {
            summary: String(formData.get("summary") || ""),
            morningRoutine: String(formData.get("morningRoutine") || ""),
            nightRoutine: String(formData.get("nightRoutine") || ""),
            productsToAvoid: String(formData.get("productsToAvoid") || ""),
            professionalAdvice: String(formData.get("professionalAdvice") || ""),
            followUpNote: String(formData.get("followUpNote") || ""),
            deliveredAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("userId", "name email");

    const user = consultation?.userId as any;

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "Your consultation results are ready",
        html: resultsReadyEmail(user.name || "there"),
      });
    }

    redirect(`/admin/consultations/${id}`);
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Save consultation result error:", error);
    return NextResponse.json(
      { error: "Failed to save consultation result" },
      { status: 500 }
    );
  }
}