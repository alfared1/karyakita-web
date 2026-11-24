import { PrismaClient } from "@prisma/client";

declare global {
  var prismaClientGlobal: PrismaClient | undefined;
}

export const db =
  globalThis.prismaClientGlobal ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClientGlobal = db;
}
