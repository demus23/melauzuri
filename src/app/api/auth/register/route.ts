import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  const body = await req.json();
  const name = (body.name || "").trim();
  const email = (body.email || "").toLowerCase().trim();
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  await dbConnect();

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const role = email === (process.env.ADMIN_EMAIL || "").toLowerCase() ? "admin" : "user";

  await User.create({ name, email, passwordHash, role });

  return NextResponse.json({ ok: true });
}
