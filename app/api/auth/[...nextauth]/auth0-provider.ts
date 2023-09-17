import Auth0Provider from 'next-auth/providers/auth0';

const { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_ISSUER } = process.env;

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

export function auth0Configured() {
  return !!(AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET && AUTH0_ISSUER);
}

export function getAuth0Provider() {
  if (!(AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET && AUTH0_ISSUER)) {
    throw new Error('Provider secrets must be set');
  }
  return Auth0Provider({
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
  });
}
