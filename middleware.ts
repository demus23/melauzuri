import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      // must be logged in for protected routes
      if (!token) return false;

      // admin routes require admin role
      if (path.startsWith("/admin")) {
        return (token as any).role === "admin";
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/checkout/:path*", "/course/:path*", "/admin/:path*"],
};
