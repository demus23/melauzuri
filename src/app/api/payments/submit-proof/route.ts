/*src\app\api\payments\submit-proof\route.ts*/
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongoose";
import PaymentOrder from "@/lib/models/PaymentOrder";
import User from "@/lib/models/User";
import cloudinary from "@/lib/cloudinary";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw"
) {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error("Upload failed"));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const orderId = String(form.get("orderId") || "");
    const file = form.get("proof") as File | null;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "Missing proof file" }, { status: 400 });
    }

    const allowed = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const order = await PaymentOrder.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // IMPORTANT: adjust this if your model uses `user` instead of `userId`
    if (String(order.userId) !== String(user._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

   const bytes = await file.arrayBuffer();
const buffer = Buffer.from(bytes);

const resourceType =
  file.type === "application/pdf"
    ? "raw"
    : "image";

const url = await uploadToCloudinary(
  buffer,
  `payment-proofs/${user._id}`,
  resourceType
);

order.proofUrl = url;

   
    order.status = "pending";
    await order.save();
await sendEmail({
  to: process.env.ADMIN_EMAIL || "",
  subject: "New payment proof submitted",
  html: `
    <h2>New payment proof submitted</h2>
    <p><strong>User:</strong> ${user.name || "Unknown"}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Order Reference:</strong> ${order.reference}</p>
    <p><strong>Product:</strong> ${order.product}</p>
    <p>Please log in to the admin dashboard to review and approve it.</p>
  `,
});

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/payments/submit-proof error:", error);
    return NextResponse.json(
      { error: "Failed to upload proof" },
      { status: 500 }
    );
  }
}