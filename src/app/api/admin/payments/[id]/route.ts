import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";
import User from "@/lib/models/User";
import ConsultationCase from "@/lib/models/ConsultationCase";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_req: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const admin = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 });
    }

    const order = await PaymentOrder.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Payment order not found" }, { status: 404 });
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending payments can be approved" },
        { status: 400 }
      );
    }

    const user = await User.findById(order.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let consultationCase = null;

    if (order.product === "consultation") {
      user.hasConsultationAccess = true;

      consultationCase = await ConsultationCase.findOne({
        paymentOrderId: order._id,
      });

      if (!consultationCase) {
        consultationCase = await ConsultationCase.create({
          userId: user._id,
          paymentOrderId: order._id,
          reference: `CONS-${order.reference}`,
          status: "pending_intake",
          intakeCompleted: false,
        });
      }
    } else if (order.product === "course") {
      user.hasCourseAccess = true;
    } else if (order.product === "bundle") {
      user.hasConsultationAccess = true;
      user.hasCourseAccess = true;

      consultationCase = await ConsultationCase.findOne({
        paymentOrderId: order._id,
      });

      if (!consultationCase) {
        consultationCase = await ConsultationCase.create({
          userId: user._id,
          paymentOrderId: order._id,
          reference: `CONS-${order.reference}`,
          status: "pending_intake",
          intakeCompleted: false,
        });
      }
    }

    order.status = "approved";
    order.approvedAt = new Date();
    order.approvedBy = admin._id;
    order.adminNote = "";

    await user.save();
    await order.save();

    return NextResponse.json({
      ok: true,
      message: "Payment approved and access granted.",
      consultationCaseId: consultationCase?._id ?? null,
    });
  } catch (error) {
    console.error("POST /api/admin/payments/[id]/approve error:", error);
    return NextResponse.json(
      { error: "Failed to approve payment" },
      { status: 500 }
    );
  }
}