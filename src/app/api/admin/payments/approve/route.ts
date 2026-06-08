import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session?.user?.email || role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await req.json();

  if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  await dbConnect();

  const order = await PaymentOrder.findById(orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  order.status = "approved";
  await order.save();

  // Unlock access based on product
  const user = await User.findById(order.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (order.product === "course") user.hasCourseAccess = true;
  if (order.product === "consultation") user.hasConsultationAccess = true;
  if (order.product === "bundle") {
    user.hasCourseAccess = true;
    user.hasConsultationAccess = true;
  }

  await user.save();

  return NextResponse.json({ ok: true });
}
