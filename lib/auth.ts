import { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "ADMIN" | "USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "USER";
    lastChecked?: number;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, 
    updateAge: 30 * 60,    
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email));

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user.role as "ADMIN" | "USER") || "USER",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
  
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.lastChecked = Math.floor(Date.now() / 1000);
      }

      const now = Math.floor(Date.now() / 1000);
      const secondsSinceLastCheck = now - (token.lastChecked || 0);

      if (secondsSinceLastCheck > 30 * 60) {
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, token.id));

        if (!dbUser || dbUser.role !== token.role) {
          throw new Error("Invalid Session");
        }

        token.lastChecked = now;
      }

      return token;
    },

    async session({ session, token }) {
    
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};