import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";
import User from "@/lib/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const order = await PaymentOrder.findOne({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ order: order || null });
}
