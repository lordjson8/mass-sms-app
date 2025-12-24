import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protect superadmin routes
    if (pathname.startsWith("/protected/users")) {
      if (token?.role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/protected/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/protected/:path*",
    "/api/contacts/:path*",
    "/api/sms/:path*",
    "/api/users/:path*",
    "/api/logs/:path*",
  ],
};
