// 결제 승인 API (POST /api/payments/confirm)
// 토스 결제창 성공 후 리다이렉트되어 호출된다. 여기서 '실제 결제 승인'이 일어난다.
// 보안 규칙: 금액은 클라이언트가 아니라 DB의 주문 금액과 반드시 대조(위변조 방지).
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { TOSS_CONFIRM_URL, tossAuthHeader, hasTossSecret } from "@/lib/toss";

export async function POST(req: Request) {
  let body: { paymentKey?: string; orderId?: string; amount?: number | string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식" }, { status: 400 });
  }

  const { paymentKey, orderId } = body;
  const amount = Number(body.amount);
  if (!paymentKey || !orderId || !Number.isFinite(amount)) {
    return NextResponse.json(
      { error: "paymentKey·orderId·amount 가 필요합니다." },
      { status: 400 }
    );
  }

  if (!hasTossSecret()) {
    return NextResponse.json(
      { error: "결제가 아직 설정되지 않았어요(TOSS_SECRET_KEY 없음)." },
      { status: 503 }
    );
  }

  // 주문 조회 (orderId = 우리 orderNumber). 금액·상태 검증.
  const order = await prisma.order.findUnique({
    where: { orderNumber: orderId },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: "주문을 찾을 수 없습니다." }, { status: 404 });
  }
  if (order.status === "PAID") {
    // 이미 승인된 주문(새로고침 등) — 그대로 성공 처리(멱등).
    return NextResponse.json({ orderNumber: order.orderNumber });
  }
  if (order.status !== "PENDING") {
    return NextResponse.json(
      { error: "결제할 수 없는 주문 상태입니다." },
      { status: 409 }
    );
  }
  if (order.totalKrw !== amount) {
    return NextResponse.json(
      { error: "결제 금액이 주문 금액과 일치하지 않습니다." },
      { status: 400 }
    );
  }

  // 토스에 결제 승인 요청
  const res = await fetch(TOSS_CONFIRM_URL, {
    method: "POST",
    headers: {
      Authorization: tossAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // 승인 실패 — 주문을 FAILED 로 표시하고 토스의 사유를 전달.
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    console.error("toss confirm failed", data);
    return NextResponse.json(
      { error: data?.message ?? "결제 승인에 실패했어요." },
      { status: 400 }
    );
  }

  // 승인 성공 — 재고 차감 + 주문 PAID 전환을 한 트랜잭션으로.
  try {
    await prisma.$transaction(async (tx) => {
      for (const it of order.items) {
        // 재고를 원자적으로 차감(경합 시 음수 방지: updateMany + 조건).
        const updated = await tx.product.updateMany({
          where: { id: it.productId, stock: { gte: it.quantity } },
          data: { stock: { decrement: it.quantity } },
        });
        if (updated.count === 0) {
          throw new Error(`재고 부족: ${it.productNameSnapshot}`);
        }
      }
      await tx.order.update({
        where: { id: order.id },
        data: { status: "PAID", paymentKey, paidAt: new Date() },
      });
    });
  } catch (e) {
    // 승인은 됐으나 재고 반영 실패 — 운영에선 결제 취소(cancel) 연동 필요.
    console.error("post-confirm stock error", e);
    return NextResponse.json(
      {
        error:
          "결제는 승인됐지만 주문 확정 중 문제가 생겼어요. 고객센터에 문의해 주세요.",
        orderNumber: order.orderNumber,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ orderNumber: order.orderNumber });
}
