import { z } from 'zod';

import { publicProcedure, router } from './trpc';
import { prisma } from '@/server/db';

export const appRouter = router({
  getUserCount: publicProcedure.query(async () => {
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
