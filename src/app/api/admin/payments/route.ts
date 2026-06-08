import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();

  // newest first (show pending/created at top)
  const orders = await PaymentOrder.find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json({ orders });
}
