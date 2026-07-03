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

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  await dbConnect();

  const order = await PaymentOrder.findById(orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const admin = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!admin) {
    return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
  }

  const customer = await User.findById(order.userId);

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  order.status = "approved";
  order.paymentStatus = "approved";
  order.approvedAt = new Date();
  order.approvedBy = admin._id;
  order.accessGranted = true;
  order.accessGrantedAt = new Date();

  if (order.paymentMethod !== "stripe") {
    order.paidAt = new Date();
  }

  await order.save();

  if (order.product === "course") {
    customer.hasCourseAccess = true;
  }

  if (order.product === "consultation") {
    customer.hasConsultationAccess = true;
  }

  if (order.product === "bundle") {
    customer.hasCourseAccess = true;
    customer.hasConsultationAccess = true;
  }

  await customer.save();

  return NextResponse.json({ ok: true });
}