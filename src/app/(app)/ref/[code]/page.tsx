import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import Referral from "@/lib/models/Referral";

export default async function RefLandingPage({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code?.toUpperCase();

  if (code) {
    await dbConnect();
    const referral = await Referral.findOne({ code });

    if (referral) {
      // Store referral code in a cookie so we can track it on signup/purchase
      // Cookie lasts 30 days — enough time for someone to sign up after clicking the link
      const cookieStore = await cookies();
      cookieStore.set("ref_code", code, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
    }
  }

  // Always redirect to register — with a query param so we can show
  // the "You've been referred — AED 15 off your first purchase" message
  redirect(`/register?ref=${code}&discount=15`);
}