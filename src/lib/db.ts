// Prisma 클라이언트 싱글턴.
// Prisma 7은 드라이버 어댑터가 필수. Supabase(PostgreSQL)는 pg 어댑터를 사용한다.
// 앱 런타임은 트랜잭션 풀러(DATABASE_URL, 6543)로 접속 — 서버리스(Vercel)에 적합.
// Next.js 개발 모드의 HMR로 인스턴스가 늘어나는 것을 막기 위해 전역에 캐싱한다.
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
