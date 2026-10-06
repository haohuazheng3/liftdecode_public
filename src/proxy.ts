import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Exact segment matches only. A trailing "(.*)" would also catch sibling paths
// such as a dotted file under the same prefix, answering a redirect where the
// site must answer 404.
const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/dashboard/(.*)",
  "/report",
  "/report/(.*)",
  "/account",
  "/account/(.*)",
  "/admin",
  "/admin/(.*)",
  "/library",
  "/library/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Dev-only previews answer a real 404 outside local development. The page's own notFound()
  // runs after the root loading UI has started streaming, which leaves the status at 200.
  const path = req.nextUrl.pathname;
  if (process.env.NODE_ENV === "production" && (path === "/dev" || path.startsWith("/dev/"))) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
