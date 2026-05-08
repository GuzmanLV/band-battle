import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

/**
 * authOptions con imports estáticos normales.
 *
 * Esto es seguro porque auth.ts solo se importa desde:
 * 1. api/auth/[...nextauth]/route.ts → API route, siempre dinámica
 * 2. Server Components que usan getServerSession() → solo en runtime
 *
 * El crash anterior ocurría porque el Root Layout (Navbar) ejecutaba
 * getServerSession() durante prerender estático de /_not-found.
 * Con Navbar como Client Component, esa cadena ya no existe.
 */

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "database",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
        session.user.isAuthorized = (user as any).isAuthorized;
      }
      return session;
    },
  },
};
