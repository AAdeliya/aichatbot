import { clerkMiddleware, getAuth, redirectToSignIn } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Create a matcher that includes all paths except those starting with /public, _next, etc.
const publicPaths = ['/auth(.*)', '/', '/api(.*)'];

// Create a matcher function to determine if the route is public
const isPublic = (path: string) => {
  return publicPaths.find(pp => 
    path.match(new RegExp(`^${pp}$`.replace('(.*)', '(.*)')))
  ) !== undefined;
}

export default function middleware(req: NextRequest) {
  const { userId } = getAuth(req);
  const path = req.nextUrl.pathname;

  // If the user is not signed in and the route isn't public, redirect to sign-in
  if (!userId && !isPublic(path)) {
    const signInUrl = new URL('/auth/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If the user is signed in and trying to access auth pages, redirect to dashboard
  if (userId && (path === '/' || path.startsWith('/auth'))) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};