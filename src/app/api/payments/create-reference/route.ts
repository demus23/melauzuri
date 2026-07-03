import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";
import User from "@/lib/models/User";

type Product = "course" | "consultation" | "bundle";
type PaymentMethod = "stripe" | "bank_transfer" | "other";

const pricing: Record<Product, number> = {
  course: 59,
  consultation: 50,
  bundle: 129,
};

function generateReference() {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(10000 + Math.random() * 90000);

  return `MLZ-${date}-${random}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const product = body.product as Product;
  const paymentMethod = (body.paymentMethod || "bank_transfer") as PaymentMethod;

  if (!["course", "consultation", "bundle"].includes(product)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  if (!["stripe", "bank_transfer", "other"].includes(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  const amount = pricing[product];

  await dbConnect();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let reference = generateReference();

  for (let i = 0; i < 5; i++) {
    const exists = await PaymentOrder.findOne({ reference });
    if (!exists) break;
    reference = generateReference();
  }

  const order = await PaymentOrder.create({
    userId: user._id,
    product,
    paymentMethod,
    amount,
    totalAmount: amount,
    currency: "USD",
    reference,
    status: paymentMethod === "stripe" ? "created" : "pending",
    paymentStatus: "pending",
  });

  return NextResponse.json({
    orderId: order._id.toString(),
    reference,
    amount: order.totalAmount,
    currency: order.currency,
    paymentMethod: order.paymentMethod,
    status: order.status,
  });
}