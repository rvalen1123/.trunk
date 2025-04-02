import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { UserRole } from "@prisma/client";

/**
 * Middleware for route protection and role-based access control
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const path = req.nextUrl.pathname;

    // If no token or not authenticated, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Role-based access control for specific routes
    if (
      path.startsWith("/dashboard/admin") &&
      token.role !== UserRole.ADMIN
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Only ADMIN and STAFF can access the forms management area
    if (
      path.startsWith("/forms/manage") &&
      token.role !== UserRole.ADMIN &&
      token.role !== UserRole.STAFF
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

/**
 * Define which routes to protect with the middleware
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/forms/:path*",
    "/settings/:path*",
    "/api/((?!auth|public).+)",
  ],
}; 