import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async () => {});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
