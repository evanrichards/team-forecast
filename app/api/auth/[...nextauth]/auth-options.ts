import {
  auth0Configured,
  getAuth0Provider,
} from '@/app/api/auth/[...nextauth]/auth0-provider';
import { mockProvider } from '@/app/api/auth/[...nextauth]/mock-provider';
import { prisma } from '@/server/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import { AppProviders } from 'next-auth/providers/index';

const ALLOWED_DOMAINS =
  process.env.NODE_ENV === 'production' ? [/loop\.com/] : [/.*/];

function getProviders() {
  const providers: AppProviders = [];
  if (auth0Configured()) {
    providers.push(getAuth0Provider());
  }
  if (process.env.NODE_ENV !== 'production') {
    providers.push(mockProvider());
  }
  return providers;
}

export function getAuthOptions(): NextAuthOptions {
  return {
    adapter: PrismaAdapter(prisma),
    providers: getProviders(),
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
  };
}
