import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * authOptions construidas lazily.
 * 
 * CERO imports estáticos de @auth/prisma-adapter ni de prisma.
 * PrismaAdapter y prisma solo se cargan la primera vez que
 * NextAuth accede a una propiedad de authOptions (runtime).
 */

let _opts: NextAuthOptions | null = null;

function buildAuthOptions(): NextAuthOptions {
  if (!_opts) {
    // require() dinámico: estos módulos solo se evalúan en runtime
    const { PrismaAdapter } = require("@auth/prisma-adapter");
    const { prisma } = require("./prisma");

    _opts = {
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
  }
  return _opts;
}

// Proxy que construye authOptions lazily en el primer acceso
export const authOptions: NextAuthOptions = new Proxy(
  {} as NextAuthOptions,
  {
    get(_target, prop: string | symbol) {
      return Reflect.get(buildAuthOptions(), prop);
    },
    ownKeys() {
      return Reflect.ownKeys(buildAuthOptions());
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Object.getOwnPropertyDescriptor(buildAuthOptions(), prop);
    },
  }
);

