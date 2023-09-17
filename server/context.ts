/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
import { prisma } from '@/server/db';
import { inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getServerSession } from 'next-auth';

type CreateContextOptions = {
  headers: Headers;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  console.log('getting session');
  const session = await getServerSession();
  console.log('got session', session);

  return {
    session,
    headers: opts.headers,
    db: prisma,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  // Fetch stuff that depends on the request

  return await createInnerTRPCContext({
    headers: opts.req.headers,
  });
};

export type Context = inferAsyncReturnType<typeof createTRPCContext>;
