// src/app/api/consultations/questionnaire/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import getOrCreateConsultation from "@/lib/getOrCreateConsultation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/lib/models/User";
import { sendEmail } from "@/lib/email";
import { consultationSubmittedEmail } from "@/lib/emailTemplates";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = String(user._id);
    const body = await req.json();

    const consultation = await getOrCreateConsultation(userId);

    consultation.basicInfo = {
      fullName: body.fullName ?? "",
      ageRange: body.ageRange ?? "",
    };

    consultation.skinProfile = {
      skinType: body.skinType ?? "",
      sensitivity: body.sensitivity ?? "",
      mainConcern: body.mainConcern ?? "",
      otherConcerns: body.otherConcerns ?? "",
    };

    consultation.routine = {
      amRoutine: body.amRoutine ?? "",
      pmRoutine: body.pmRoutine ?? "",
      activeIngredients: body.activeIngredients ?? "",
    };

    consultation.history = {
      duration: body.duration ?? "",
      pregnant: body.pregnant ?? "",
      historyNotes: body.historyNotes ?? "",
    };

    consultation.intakeCompleted = true;
    consultation.status = "active";

    await consultation.save();

    try {
  await sendEmail({
    to: user.email,
    subject: "Your consultation has been submitted",
    html: consultationSubmittedEmail(user.name || body.fullName || "there"),
  });
} catch (emailError) {
  console.error("Consultation email failed:", emailError);
}

    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New consultation submitted",
        html: `
          <h2>New consultation submitted</h2>
          <p><strong>Client:</strong> ${body.fullName || user.name || "Unknown"}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Main concern:</strong> ${body.mainConcern || "Not provided"}</p>
          <p>Please log in to the admin dashboard to review the case.</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      consultationId: consultation._id,
    });
  } catch (error) {
    console.error("Questionnaire save error:", error);
    return NextResponse.json(
      { error: "Failed to save questionnaire" },
      { status: 500 }
    );
  }
}