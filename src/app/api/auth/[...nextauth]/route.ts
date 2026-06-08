import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";

const handler = NextAuth({
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
        const user = await User.findOne({ email });

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
      if (user) {
        token.role = (user as any).role;
        token.hasCourseAccess = (user as any).hasCourseAccess;
        token.hasConsultationAccess = (user as any).hasConsultationAccess;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      (session.user as any).hasCourseAccess = token.hasCourseAccess;
      (session.user as any).hasConsultationAccess = token.hasConsultationAccess;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
