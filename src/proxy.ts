import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canViewAttendanceStatistics } from "@/src/lib/attendance_statistics_access";
import { verifySessionToken } from "@/src/lib/session";

export function proxy(request: NextRequest) {
  const user = verifySessionToken(request.cookies.get("session")?.value);
  const isAuthenticated = user !== null;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/auth" || pathname.startsWith("/auth/");
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const isStatisticsRoute =
    normalizedPath === "/statistics" || normalizedPath.startsWith("/statistics/");

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const response = NextResponse.next();
    response.cookies.delete("user");
    response.cookies.delete("session");
    return response;
  }

  if (!isAuthenticated) {
    const response = NextResponse.redirect(new URL("/auth", request.url));
    response.cookies.delete("user");
    response.cookies.delete("session");
    return response;
  }

  if (
    isStatisticsRoute &&
    !canViewAttendanceStatistics(user.role)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|img|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};