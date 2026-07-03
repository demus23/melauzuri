/*src\app\api\stripe\webhook\route.ts*/
import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";
import User from "@/lib/models/User";
import Referral from "@/lib/models/Referral";
import { grantAccess } from "@/lib/payments/grantAccess";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    await dbConnect();

    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId in Stripe metadata" },
        { status: 400 }
      );
    }

    const order = await PaymentOrder.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Payment order not found" },
        { status: 404 }
      );
    }

    if (order.accessGranted) {
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    order.status = "approved";
    order.paymentStatus = "paid";
    order.paidAt = new Date();
    order.accessGranted = true;
    order.accessGrantedAt = new Date();
    order.stripeSessionId = session.id;
    order.stripePaymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : "";

    await order.save();

    // Grant course/consultation access — unchanged from original
    await grantAccess(order);

    // ── Referral reward tracking ──────────────────────────────────────────
    const refCode = session.metadata?.refCode;

    if (refCode) {
      try {
        const referral = await Referral.findOne({ code: refCode.toUpperCase() });

        if (referral) {
          const buyerUserId = session.metadata?.userId;

          // Prevent self-referral
          const isSelfReferral =
            buyerUserId &&
            referral.referrerId.toString() === buyerUserId;

          if (!isSelfReferral) {
            // Find or register this use in the referral document
            const existingUse = referral.uses?.find(
              (u: any) => u.userId?.toString() === buyerUserId
            );

            if (!existingUse) {
              // First purchase via this referral — log the use and create reward
              const buyerUser = buyerUserId
                ? await User.findById(buyerUserId).lean()
                : null;

              referral.uses.push({
                userId: buyerUserId ?? null,
                email: buyerUser?.email ?? session.customer_email ?? "",
                usedAt: new Date(),
                purchased: true,
                purchasedAt: new Date(),
              });

              // AED 25 reward for the referrer — status "pending" until support applies it
              referral.rewards.push({
                forUserId: buyerUserId ?? null,
                amount: 25,
                status: "pending",
                appliedAt: null,
                note: `Stripe payment ${session.id}`,
              });

              await referral.save();
            } else if (!existingUse.purchased) {
              // Use was logged at signup but purchase hadn't happened yet
              existingUse.purchased = true;
              existingUse.purchasedAt = new Date();

              referral.rewards.push({
                forUserId: existingUse.userId ?? null,
                amount: 25,
                status: "pending",
                appliedAt: null,
                note: `Stripe payment ${session.id}`,
              });

              await referral.save();
            }
            // If existingUse.purchased is already true, this is a repeat purchase —
            // only the first purchase earns a referral reward, so we skip it.
          }
        }
      } catch (referralErr) {
        // Referral tracking failure must never break access granting —
        // log it but don't return an error to Stripe (which would cause a retry)
        console.error("[webhook] referral tracking error:", referralErr);
      }
    }
    // ─────────────────────────────────────────────────────────────────────
  }

  return NextResponse.json({ received: true });
}