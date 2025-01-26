import { RowDataPacket } from 'mysql2';
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import pool from '../../../lib/db';
import NextAuth from 'next-auth/next';

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
        const hardcodedUser = {
          id: '곶감',
          name: '정재연',
          email: 'hello@good.com',
          hashedPassword: '12345',
          role: 'User',
        };
        if (!credentials) {
          console.warn('credentials must be required.');
          return null;
        }
        if (credentials.email === hardcodedUser.email && credentials.password === hardcodedUser.hashedPassword) {
          return hardcodedUser as User;
        }
        const [rows] = await pool.query<UserRows[]>(
          'SELECT id, name, email, hashed_password, user_type FROM users WHERE email = ?',
          [credentials.email]
        );
        const user = rows[0];

        if (user && user.hashed_password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            hashedPassword: user.hahshed_password,
            role: user.user_type,
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
