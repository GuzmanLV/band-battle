/**
 * Lazy PrismaClient singleton.
 *
 * CERO imports estáticos de @prisma/client.
 * El módulo de Prisma solo se carga la primera vez que se accede
 * a una propiedad (runtime), nunca durante build/module evaluation.
 * Esto previene el crash de Vercel: "Prisma has detected that this
 * project was built on Vercel, which caches dependencies."
 */

const globalForPrisma = globalThis as unknown as { _prisma?: unknown };

function getClient() {
  if (!globalForPrisma._prisma) {
    // require() dinámico: @prisma/client se evalúa AQUÍ, no al importar este módulo
    const { PrismaClient } = require("@prisma/client");
    globalForPrisma._prisma = new PrismaClient();
  }
  return globalForPrisma._prisma as any;
}

export const prisma = new Proxy({} as any, {
  get(_target, prop: string | symbol) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function"
      ? (value as Function).bind(client)
      : value;
  },
});

