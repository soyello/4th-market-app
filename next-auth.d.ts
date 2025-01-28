import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: { id?: string; role?: string } & DefaultSession['user'];
  }
  interface User {
    role: string;
    createdAt: Date;
    updatedAt: Date | null;
    hashedPassword?: string;
  }
  interface JWT {
    id: string;
    role: string;
  }
}
