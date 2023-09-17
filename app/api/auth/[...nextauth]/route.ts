import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { type AppProviders } from 'next-auth/providers/index';
import { env } from 'process';
import { prisma } from '@/server/db';
const {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_ISSUER,
  NODE_ENV,
  APP_ENV,
} = process.env;

interface Auth0Profile {
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  sid: string;
}
let useMockProvider = false;

if (
  (NODE_ENV !== 'production' || APP_ENV === 'test') &&
  !(AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET && AUTH0_ISSUER)
) {
  console.log('⚠️ Using mocked GitHub auth correct credentials were not added');
  useMockProvider = true;
}
const providers: AppProviders = [];
if (useMockProvider) {
  providers.push(
    CredentialsProvider({
      id: 'github',
      name: 'Mocked GitHub',
      async authorize(credentials) {
        if (credentials) {
          const user = {
            id: credentials.name,
            name: credentials.name,
            email: `${credentials.name}@loop.com`,
          };
          return user;
        }
        return null;
      },
      credentials: {
        name: { type: 'test' },
      },
    }),
  );
} else {
  if (!(AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET && AUTH0_ISSUER)) {
    throw new Error('Provider secrets must be set');
  }
  providers.push(
    Auth0Provider({
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      issuer: AUTH0_ISSUER,
      profile(profile: Auth0Profile) {
        return {
          id: profile.sid,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  );
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
