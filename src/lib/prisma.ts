import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";

// .envファイルから直接読み込み
const envPath = path.join(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const match = envContent.match(/DATABASE_URL=(.+)/);
const databaseUrl = match ? match[1].trim() : "";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// グローバルに単一のpgプールを作成
let globalPool: pg.Pool | undefined;

function getPool(): pg.Pool {
  if (!globalPool) {
    globalPool = new pg.Pool({
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return globalPool;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg(getPool()),
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
