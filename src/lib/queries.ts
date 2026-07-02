// 서버 전용 데이터 조회 함수. 화면(서버 컴포넌트)과 API가 공유한다.
import { prisma } from "./db";

/** 홈(S1): 모든 팝업을 시작일 최신순으로. 상태는 화면에서 날짜로 계산. */
export function getAllPopups() {
  return prisma.popup.findMany({ orderBy: { startDate: "desc" } });
}

/** 팝업 상세(S2): slug로 팝업 + 판매중 굿즈. */
export function getPopupBySlug(slug: string) {
  return prisma.popup.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/** 상품 상세(S3): slug로 상품 + 소속 팝업. */
export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { popup: true },
  });
}

/** 카테고리 탐색(보조): 카테고리 필터(없으면 전체). */
export function getProducts(category?: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
    },
    include: { popup: true },
    orderBy: { createdAt: "asc" },
  });
}

/** 주문 완료(S6): 주문번호로 주문 + 상세. */
export function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

/** AI 챗봇 컨텍스트용: 팝업/상품 요약 데이터. */
export function getCatalogForContext() {
  return prisma.popup.findMany({
    include: {
      products: {
        where: { isActive: true },
        select: {
          slug: true,
          nameKo: true,
          nameEn: true,
          category: true,
          priceKrw: true,
          stock: true,
        },
      },
    },
    orderBy: { startDate: "desc" },
  });
}
