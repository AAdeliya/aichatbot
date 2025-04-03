import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/api(.*)','/auth(.*)', '/']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}




// import { clerkMiddleware } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// // Create a matcher that includes all paths except those starting with /public, _next, etc.
// const publicPaths = ['/auth(.*)', '/', '/api(.*)'];

// // Create a matcher function to determine if the route is public
// const isPublic = (path: string) => {
//   return publicPaths.find(pp => 
//     path.match(new RegExp(`^${pp}$`.replace('(.*)', '(.*)')))
//   ) !== undefined;
// }

// export default clerkMiddleware((auth, req) => {
//   const path = req.nextUrl.pathname;
  
//   // If the user is not signed in and the route isn't public, redirect to sign-in
//   if (!auth.userId && !isPublic(path)) {

//     const signInUrl = new URL('/auth/sign-in', req.url);
//     signInUrl.searchParams.set('redirect_url', req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   // If the user is signed in and trying to access auth pages, redirect to dashboard
//   if (auth.userId && (path === '/' || path.startsWith('/auth'))) {
//     const dashboardUrl = new URL('/dashboard', req.url);
//     return NextResponse.redirect(dashboardUrl);
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };