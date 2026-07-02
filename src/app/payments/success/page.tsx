"use client";

// 토스 결제창 성공 후 리다이렉트되는 페이지. 쿼리(paymentKey/orderId/amount)를 받아
// 서버 승인 API를 호출한다. 승인 성공 → 장바구니 비우고 주문완료로 이동.
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/components/I18nProvider";

function Confirming() {
  const params = useSearchParams();
  const router = useRouter();
  const { clear } = useCart();
  const { t } = useI18n();
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // 중복 승인 요청 방지
    ran.current = true;

    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amount = params.get("amount");
    if (!paymentKey || !orderId || !amount) {
      setError(t("pay.failHelp"));
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? t("pay.failHelp"));
        clear();
        router.replace(`/order/${data.orderNumber}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("pay.failHelp"));
      }
    })();
  }, [params, router, clear, t]);

  if (error) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-5xl">😢</p>
        <h1 className="mt-3 font-display text-xl font-extrabold text-ink">
          {t("pay.failTitle")}
        </h1>
        <p className="mt-2 text-sm text-concrete">{error}</p>
        <Link
          href="/checkout"
          className="mt-6 inline-block rounded-full bg-coral-deep px-6 py-3 font-display font-bold text-white shadow-pop transition hover:-translate-y-0.5"
        >
          {t("pay.retry")}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 text-center text-concrete">
      <p className="animate-pulse text-4xl">💳</p>
      <p className="mt-3">{t("pay.confirming")}</p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={<div className="py-16 text-center text-concrete">…</div>}
    >
      <Confirming />
    </Suspense>
  );
}
