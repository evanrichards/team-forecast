import CredentialsProvider from 'next-auth/providers/credentials';

export function mockProvider() {
  return CredentialsProvider({
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
  });
}
