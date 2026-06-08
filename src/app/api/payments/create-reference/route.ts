import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";

function generateReference() {
  const n = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `SKIN-${n}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const product = body.product as "course" | "consultation" | "bundle";

  const pricing: Record<string, number> = { course: 59, consultation: 70, bundle: 99 };
  const amount = pricing[product];

  if (!amount) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  await dbConnect();

  // create unique reference
  let reference = generateReference();
  // retry a couple times if collision
  for (let i = 0; i < 5; i++) {
    const exists = await PaymentOrder.findOne({ reference });
    if (!exists) break;
    reference = generateReference();
  }

  // IMPORTANT: you need userId. We'll store it in token/session soon.
  // For MVP: use email lookup
  const User = (await import("@/lib/models/User")).default;
  const user = await User.findOne({ email: session.user.email.toLowerCase() });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const order = await PaymentOrder.create({
    userId: user._id,
    product,
    amount,
    currency: "USD",
    reference,
    status: "created",
  });

  return NextResponse.json({
    orderId: order._id.toString(),
    reference,
    amount,
    currency: "USD",
  });
}
