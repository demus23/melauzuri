// src/lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";

export const authOptions: NextAuthOptions = {
  // ✅ strongly recommended
  secret: process.env.NEXTAUTH_SECRET,

  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) return null;

        await dbConnect();
        const user = await User.findOne({ email }).select(
          "_id email name role hasCourseAccess hasConsultationAccess passwordHash"
        );

        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || "",
          role: user.role,
          hasCourseAccess: user.hasCourseAccess,
          hasConsultationAccess: user.hasConsultationAccess,
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // ✅ First login: copy user fields into token
      if (user) {
        (token as any).uid = (user as any).id;
        token.email = (user as any).email; // ✅ ensure always set
        (token as any).role = (user as any).role;
        (token as any).hasCourseAccess = (user as any).hasCourseAccess;
        (token as any).hasConsultationAccess = (user as any).hasConsultationAccess;
        (token as any)._lastSync = Date.now();
        return token;
      }

      // ✅ Refresh from DB sometimes
      const lastSync = (token as any)._lastSync ?? 0;
      if (Date.now() - lastSync < 30_000) return token;

      try {
        const email = (token.email as string | undefined)?.toLowerCase();
        if (!email) return token;

        await dbConnect();
        const dbUser = await User.findOne({ email }).select(
          "role hasCourseAccess hasConsultationAccess"
        ).lean();

        if (dbUser) {
          (token as any).role = dbUser.role;
          (token as any).hasCourseAccess = dbUser.hasCourseAccess;
          (token as any).hasConsultationAccess = dbUser.hasConsultationAccess;
        }
        (token as any)._lastSync = Date.now();
      } catch {
        // keep existing token
      }

      return token;
    },

    async session({ session, token }) {
      // expose to client
      (session.user as any).id = (token as any).uid;
      (session.user as any).role = (token as any).role;
      (session.user as any).hasCourseAccess = (token as any).hasCourseAccess;
      (session.user as any).hasConsultationAccess = (token as any).hasConsultationAccess;
      return session;
    },
  },
};
