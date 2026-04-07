import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma v7 用の設定
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "dotenv"],
};

export default nextConfig;
