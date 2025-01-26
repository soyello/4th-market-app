import { RowDataPacket } from 'mysql2';
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth/next';
import MySQLAdapter from '@/lib/mysqlAdapter';

interface UserRows extends RowDataPacket {
  id: string;
  name: string;
  email: string;
  hahshed_password: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'ID를 입력하세요.' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.warn('credentials must be required.');
          return null;
        }

        const user = await MySQLAdapter.getUser(credentials.email);

        if (user && (await bcrypt.compare(credentials.password, user.hashedPassword))) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            hashedPassword: user.hashedPassword,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('token', token);
      console.log('user', user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('@', session, token);
      if (token) {
        session.user = {
          ...(session.user || {}),
          id: token.id as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
