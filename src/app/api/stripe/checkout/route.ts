// src/app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";
import User from "@/lib/models/User";

type Product = "course" | "consultation" | "consultation-derm" | "bundle";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const pricing: Record<Product, { name: string; amount: number }> = {
  course: {
    name: "Melazuri Skin Education Course",
    amount: 59,
  },
  consultation: {
    name: "Melazuri Skin Consultation",
    amount: 50,
  },
  "consultation-derm": {
    name: "Melazuri Dermatologist-Assisted Consultation",
    amount: 100,
  },
  bundle: {
    name: "Melazuri Complete Skin Transformation Bundle",
    amount: 129,
  },
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

  if (!["course", "consultation", "consultation-derm", "bundle"].includes(product)) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  await dbConnect();

  const user = await User.findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Read referral code from cookie if present
  const cookieStore = await cookies();
  const refCode = cookieStore.get("ref_code")?.value ?? null;

  const reference = generateReference();
  const item = pricing[product];

  const order = await PaymentOrder.create({
    userId: user._id,
    product,
    paymentMethod: "stripe",
    amount: item.amount,
    totalAmount: item.amount,
    currency: "AED",
    reference,
    status: "created",
    paymentStatus: "pending",
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email,
    line_items: [
      {
        price_data: {
          currency: "aed",
          product_data: {
            name: item.name,
            description: `Reference: ${reference}`,
          },
          unit_amount: item.amount * 100, // Stripe expects fils (AED smallest unit)
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: order._id.toString(),
      reference,
      product,
      userId: user._id.toString(),
      // Pass referral code through so the webhook can credit the referrer
      refCode: refCode ?? "",
    },
    success_url: `${baseUrl}/checkout/success?orderId=${order._id.toString()}`,
    cancel_url: `${baseUrl}/checkout/manual?product=${product}`,
  });

  order.stripeSessionId = checkoutSession.id;
  await order.save();

  return NextResponse.json({ url: checkoutSession.url });
}