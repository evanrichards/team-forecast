import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";

import { AppProviders } from "next-auth/providers/index";
const {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_ISSUER,
  NODE_ENV,
  APP_ENV,
} = process.env;

type Auth0Profile = {
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
};
let useMockProvider = false;

if (
  (NODE_ENV !== "production" || APP_ENV === "test") &&
  !(AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET && AUTH0_ISSUER)
) {
  console.log("⚠️ Using mocked GitHub auth correct credentials were not added");
  useMockProvider = true;
}
const providers: AppProviders = [];
if (useMockProvider) {
  providers.push(
    CredentialsProvider({
      id: "github",
      name: "Mocked GitHub",
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
        name: { type: "test" },
      },
    }),
  );
} else {
  if (!(AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET && AUTH0_ISSUER)) {
    throw new Error("Provider secrets must be set");
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

const handler = NextAuth({
  providers,
});

export { handler as GET, handler as POST };
