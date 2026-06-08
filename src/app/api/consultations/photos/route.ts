// src/app/api/consultations/photos/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import { authOptions } from "@/lib/authOptions";
import getOrCreateConsultation from "@/lib/getOrCreateConsultation";
import User from "@/lib/models/User";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

async function uploadToCloudinary(buffer: Buffer, folder: string) {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error("Cloudinary upload failed"));
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

    await dbConnect();

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = String(user._id);

    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const consultation = await getOrCreateConsultation(userId);
    const savedPhotos: string[] = [];

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Only JPG, PNG, and WEBP photos are allowed" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const url = await uploadToCloudinary(
        buffer,
        `consultations/${userId}`
      );

      savedPhotos.push(url);
    }

    consultation.photos = [...(consultation.photos || []), ...savedPhotos];
    consultation.photosUploaded = true;

    if (consultation.intakeCompleted) {
      consultation.status = "submitted";
    } else {
      consultation.status = "pending_intake";
    }

    await consultation.save();

    return NextResponse.json({
      success: true,
      photos: consultation.photos,
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload photos" },
      { status: 500 }
    );
  }
}