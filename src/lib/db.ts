// Prisma 클라이언트 싱글턴.
// Prisma 7은 드라이버 어댑터가 필수. SQLite는 better-sqlite3 어댑터를 사용한다.
// Next.js 개발 모드의 HMR로 인스턴스가 늘어나는 것을 막기 위해 전역에 캐싱한다.
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
