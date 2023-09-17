import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { type AppProviders } from 'next-auth/providers/index';
import { env } from 'process';
import { prisma } from '@/server/db';
import {
  auth0Configured,
  getAuth0Provider,
} from '@/app/api/auth/[...nextauth]/auth0-provider';
import { mockProvider } from '@/app/api/auth/[...nextauth]/mock-provider';
const { NODE_ENV, APP_ENV } = process.env;

let useMockProvider = false;

if ((NODE_ENV !== 'production' || APP_ENV === 'test') && !auth0Configured()) {
  console.log('⚠️ Using mocked GitHub auth correct credentials were not added');
  useMockProvider = true;
}
const providers: AppProviders = [];
if (useMockProvider) {
  providers.push(mockProvider());
} else {
  providers.push(getAuth0Provider());
}

const ALLOWED_DOMAINS = env.NODE_ENV === 'production' ? [/loop\.com/] : [/.*/];

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async signIn({ user }) {
      const { email: userEmail } = user;
      const domain = userEmail?.split('@')[1];

      if (
        !domain ||
        !ALLOWED_DOMAINS.some((domainRegex) => domainRegex.test(userEmail))
      ) {
        return false;
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
