import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

// グローバルに単一のpgプールを作成
function getPool(): pg.Pool {
  if (!globalForPrisma.pool) {
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }
    globalForPrisma.pool = new pg.Pool({
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return globalForPrisma.pool;
}

export const prisma = globalForPrisma.prisma ?? (databaseUrl
  ? new PrismaClient({
      adapter: new PrismaPg(getPool()),
    })
  : new PrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
