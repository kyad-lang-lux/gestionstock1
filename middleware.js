import { NextResponse } from 'next/server';

export async function middleware(request) {
  // 1. Récupérer le cookie de session
  const session = request.cookies.get('user_session');

  // 2. Définir les routes à protéger
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/produits') || 
                          request.nextUrl.pathname.startsWith('/categories') || 
                          request.nextUrl.pathname.startsWith('/parametres');

  // 3. Si l'utilisateur n'a pas de session et tente d'accéder au dashboard
  if (isDashboardPage && !session) {
    // Rediriger vers la page de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Si l'utilisateur est déjà connecté et tente d'aller sur /login
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurer sur quelles routes le middleware doit s'exécuter
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/produits/:path*',
    '/categories/:path*',
    '/parametres/:path*',
    '/login'
  ],
};