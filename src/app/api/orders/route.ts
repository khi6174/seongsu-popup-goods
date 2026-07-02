// 주문 생성 API (POST /api/orders) — 비회원 + 모의결제.
// 백엔드 규칙: 가격은 클라이언트를 믿지 않고 DB에서 다시 계산, 주문 스냅샷 저장, 재고 확인.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { regionForCountry, SHIPPING_FEES_KRW } from "@/lib/config";

type IncomingItem = { productId: string; quantity: number };

function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}

export async function POST(req: Request) {
  let body: {
    ordererName?: string;
    ordererEmail?: string;
    shippingCountry?: string;
    shippingAddress?: string;
    items?: IncomingItem[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식" }, { status: 400 });
  }

  const { ordererName, ordererEmail, shippingCountry, shippingAddress, items } =
    body;

  // 필수 입력 검증 (05 예외 체크리스트)
  if (!ordererName || !ordererEmail || !shippingCountry || !shippingAddress) {
    return NextResponse.json(
      { error: "이름·이메일·국가·주소는 필수입니다." },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "장바구니가 비어 있습니다." },
      { status: 400 }
    );
  }

  // DB에서 상품을 다시 조회해 가격·재고를 신뢰 가능한 값으로 확정
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const orderItemsData = [];
  let subtotalKrw = 0;

  for (const item of items) {
    const product = byId.get(item.productId);
    const qty = Math.max(1, Math.floor(item.quantity || 0));
    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "존재하지 않는 상품이 포함되어 있습니다." },
        { status: 400 }
      );
    }
    if (product.stock <= 0) {
      return NextResponse.json(
        { error: `품절된 상품입니다: ${product.nameKo}` },
        { status: 409 }
      );
    }
    subtotalKrw += product.priceKrw * qty;
    orderItemsData.push({
      productId: product.id,
      productNameSnapshot: product.nameKo, // 주문 당시 이름 스냅샷
      priceKrwSnapshot: product.priceKrw, // 주문 당시 가격 스냅샷
      quantity: qty,
    });
  }

  // 배송비·합계 계산
  const region = regionForCountry(shippingCountry);
  const shippingFeeKrw = SHIPPING_FEES_KRW[region];
  const totalKrw = subtotalKrw + shippingFeeKrw;

  // 주문번호 생성: SS-YYYYMMDD-####
  const now = new Date();
  const ymd = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(
    now.getDate(),
    2
  )}`;
  const seq = (await prisma.order.count()) + 1;
  const orderNumber = `SS-${ymd}-${pad(seq, 4)}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      ordererName,
      ordererEmail,
      shippingCountry,
      shippingAddress,
      shippingRegion: region,
      subtotalKrw,
      shippingFeeKrw,
      totalKrw,
      status: "PENDING", // 결제 대기 — 토스 승인 성공 시 PAID 로 전환
      items: { create: orderItemsData },
    },
  });

  // 토스 결제창에 표시할 주문명 (예: "치즈냥 스티커 팩 외 2건")
  const totalQty = orderItemsData.reduce((n, i) => n + i.quantity, 0);
  const orderName =
    orderItemsData.length === 1 && orderItemsData[0].quantity === 1
      ? orderItemsData[0].productNameSnapshot
      : `${orderItemsData[0].productNameSnapshot} 외 ${totalQty - 1}건`;

  // 클라이언트는 이 금액/주문명으로 토스 결제창을 연다. (금액은 서버가 확정한 값)
  return NextResponse.json({
    orderNumber: order.orderNumber,
    amount: order.totalKrw,
    orderName,
  });
}
