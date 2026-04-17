import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtenemos si existe la cookie de autenticación que indicamos en el login
  const isAuthenticated = request.cookies.has('isAuthenticated');
  
  const { pathname } = request.nextUrl;

  // Se considera ruta pública todas las que comiencen con /auth
  const isPublicRoute = pathname.startsWith('/auth');

  // 1. Si está en login/auth pero YA inició sesión, regresarlo adentro de la aplicación.
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Si NO está en login/auth y NO está autenticado, mandarlo al login a identificarse.
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 3. En caso contrario, dejarlo pasar normalmente.
  return NextResponse.next();
}

export const config = {
  // El matcher define en qué rutas se va a disparar este código.
  // Ignoramos la ruta de API, archivos estáticos del build (_next), imágenes y el icono.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img|.*\\.svg|.*\\.png|.*\\.jpg).*)'],
};
