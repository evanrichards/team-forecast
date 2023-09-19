import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from './trpc';
import { prisma } from '@/server/db';

export const appRouter = createTRPCRouter({
  getUserCount: publicProcedure.query(async (ctx) => {
    console.log('ctx', ctx);
    const userCount = await prisma.user.count();
    return `${userCount} users`;
  }),
  setData: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    // Here you would update a database using the
    // input string passed into the procedure
    console.log(input);
    return input;
  }),
});
// This type will be used as a reference later...
export type AppRouter = typeof appRouter;
