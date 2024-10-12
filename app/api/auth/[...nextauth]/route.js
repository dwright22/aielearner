import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/app/utils/prisma';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/app/utils/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Authorizing with credentials:', credentials);
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          await limiter.check(10, 'CACHE_TOKEN');
        } catch {
          throw new Error('Too many requests, please try again later.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        console.log('Found user:', user);

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.hashedPassword) {
          throw new Error('Password not set for this user');
        }

        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        console.log('Password valid:', isValid);

        if (!isValid) {
          throw new Error('Invalid password');
        }
        console.log('Authorized user:', user);
        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      console.log("Session in callback:", session);
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };