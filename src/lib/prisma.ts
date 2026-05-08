import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Cachear en todos los entornos para evitar múltiples instancias en hot-reload
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
