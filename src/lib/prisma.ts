import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  _prisma?: PrismaClient;
};

function getClient(): PrismaClient {
  if (!globalForPrisma._prisma) {
    globalForPrisma._prisma = new PrismaClient();
  }
  return globalForPrisma._prisma;
}

/**
 * Lazy singleton Proxy.
 * - Importing this module does NOT instantiate PrismaClient.
 * - PrismaClient is only created on first property access (runtime).
 * - This prevents Vercel build crashes when modules are evaluated
 *   during static page generation (e.g. /_not-found).
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function"
      ? (value as Function).bind(client)
      : value;
  },
});
