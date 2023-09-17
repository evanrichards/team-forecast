import NextAuth from 'next-auth';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/auth-options';

const handler = NextAuth(getAuthOptions());

export { handler as GET, handler as POST };
