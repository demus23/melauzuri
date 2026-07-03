import { NextRequest, NextResponse } from "next/server";
import { requireAccess } from "@/lib/requireAccess";
import dbConnect from "@/lib/mongoose";
import JournalEntry from "@/lib/models/JournalEntry";

export async function POST(req: NextRequest) {
  const user = await requireAccess("journal");
  await dbConnect();

  const formData = await req.formData();
  const feeling = formData.get("feeling");
  const note = formData.get("note");
  const photo = formData.get("photo");

  if (
    typeof feeling !== "string" ||
    !["great", "okay", "irritated", "flare-up"].includes(feeling)
  ) {
    return NextResponse.json({ error: "Invalid feeling value" }, { status: 400 });
  }

  let photoUrl: string | null = null;

  if (photo instanceof File && photo.size > 0) {
    // TODO: wire to your actual storage provider (S3, Cloudinary, Vercel Blob, etc.)
    // Placeholder: this route currently does not persist the binary photo data.
    // photoUrl should be set to the uploaded file's public URL once storage is connected.
  }

  await JournalEntry.create({
    userId: user._id,
    feeling,
    note: typeof note === "string" ? note.slice(0, 1000) : "",
    photoUrl,
  });

  return NextResponse.json({ ok: true });
}