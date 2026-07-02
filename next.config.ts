import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 네이티브 모듈(better-sqlite3)과 Prisma는 서버 번들에서 외부 처리해야 한다.
  serverExternalPackages: [
    "@prisma/adapter-better-sqlite3",
    "better-sqlite3",
  ],
};

export default nextConfig;
