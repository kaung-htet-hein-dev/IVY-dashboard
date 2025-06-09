import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create matchers for public and protected routes
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/bookings(.*)",
  "/settings(.*)",
  "/branches(.*)",
  "/users(.*)",
  "/categories(.*)",
  "/services(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Protect all matched routes
    await auth.protect();
  } else if (!isPublicRoute(req)) {
    // If not public and not protected, protect it by default
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
