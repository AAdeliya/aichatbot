import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';


//defines which routes are public 
const isPublicRoute = createRouteMatcher(['/api(.*)','/auth(.*)', '/']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    //redirects unauth users
    await auth.protect()
  }
})

export const config = {
  //controls which paths run the middleware 
  matcher: [
    //this tells next.js routes should be processed by the middleware
    
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}