import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session?.user?.email || role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId, note } = await req.json();
  if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  await dbConnect();

  const order = await PaymentOrder.findById(orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  order.status = "rejected";
  order.adminNote = note || "";
  await order.save();

  return NextResponse.json({ ok: true });
}
