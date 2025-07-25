import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createGuestUser } from '@/lib/db/queries';
import { authConfig } from './auth.config';
import type { DefaultJWT } from 'next-auth/jwt';

export type UserType = 'guest' | 'regular';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
    access_token?: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL as string;

          // 1. 获取 access token
          const tokenRes = await fetch(`${apiBase}/auth/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ username: email, password }),
          });

          if (!tokenRes.ok) {
            return null;
          }

          const { access_token } = await tokenRes.json();

          // 2. 使用 token 获取当前用户信息
          const meRes = await fetch(`${apiBase}/auth/me`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (!meRes.ok) {
            return null;
          }

          const user = await meRes.json();

          return { ...user, access_token, type: 'regular' };
        } catch {
          return null;
        }
      },
    }),
    Credentials({
      id: 'guest',
      credentials: {},
      async authorize() {
        const [guestUser] = await createGuestUser();
        return { ...guestUser, type: 'guest' };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id as string;
        token.type = (user as any).type;
        token.access_token = (user as any).access_token;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type as any;
      }

      // 将 access_token 暴露给前端（仅在需要时，可移除）
      (session as any).access_token = (token as any).access_token;

      return session;
    },
  },
});
