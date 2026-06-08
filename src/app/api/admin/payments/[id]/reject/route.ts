import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";
import User from "@/lib/models/User";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteContext) {
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

    const body = await req.json().catch(() => ({}));
    const adminNote = String(body?.adminNote || "").trim();

    const order = await PaymentOrder.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Payment order not found" }, { status: 404 });
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending payments can be rejected" },
        { status: 400 }
      );
    }

    order.status = "rejected";
    order.rejectedAt = new Date();
    order.rejectedBy = admin._id;
    order.adminNote = adminNote;

    await order.save();

    return NextResponse.json({
      ok: true,
      message: "Payment rejected.",
    });
  } catch (error) {
    console.error("POST /api/admin/payments/[id]/reject error:", error);
    return NextResponse.json(
      { error: "Failed to reject payment" },
      { status: 500 }
    );
  }
}