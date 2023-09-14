import { appRouter } from '@/server';
import { httpBatchLink } from '@trpc/client';

const url =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
    : 'http://localhost:3000/api/trpc';

export const serverClient = appRouter.createCaller({
  links: [httpBatchLink({ url })],
});
