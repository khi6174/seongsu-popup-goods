"use client";

// 토스 결제창 실패/취소 시 리다이렉트되는 페이지. code·message 쿼리를 안내한다.
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

function Fail() {
  const params = useSearchParams();
  const { t } = useI18n();
  const message = params.get("message");

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-5xl">😢</p>
      <h1 className="mt-3 font-display text-xl font-extrabold text-ink">
        {t("pay.failTitle")}
      </h1>
      <p className="mt-2 text-sm text-concrete">
        {message || t("pay.failHelp")}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/checkout"
          className="rounded-full bg-coral-deep px-6 py-3 font-display font-bold text-white shadow-pop transition hover:-translate-y-0.5"
        >
          {t("pay.retry")}
        </Link>
        <Link
          href="/cart"
          className="rounded-full border-2 border-ink px-6 py-3 font-display font-bold text-ink"
        >
          {t("pay.backToCart")}
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={null}>
      <Fail />
    </Suspense>
  );
}
