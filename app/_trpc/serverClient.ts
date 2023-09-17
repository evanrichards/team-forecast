import { getApiUrl } from '@/app/_trpc/utils';
import { appRouter } from '@/server';
import { httpBatchLink } from '@trpc/client';

export const serverClient = appRouter.createCaller({
  links: [httpBatchLink({ url: getApiUrl() })],
});
