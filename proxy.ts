import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ['/__clerk/:path*', '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
