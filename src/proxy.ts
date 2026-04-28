import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const userCookie = request.cookies.get("user");

  let isAuthenticated = false;

  if (userCookie) {
    try {
      JSON.parse(decodeURIComponent(userCookie.value));
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname.startsWith("/auth");

  // Si ya está logueado y entra a /auth → lo sacamos
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si NO está logueado y entra a rutas privadas → lo mandamos a login
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|img|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};