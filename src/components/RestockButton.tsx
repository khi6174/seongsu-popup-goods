"use client";

// 품절 상품의 '재입고 알림 받기' 버튼(정적). 실제 알림 발송은 2차 기능.
// 지원 페르소나: 회색 도장 대신 다정하게 → 누르면 준비중 안내 문구.
import { useState } from "react";
import Link from "next/link";
import { useI18n } from "./I18nProvider";

export function RestockButton({ popupSlug }: { popupSlug: string }) {
  const { t } = useI18n();
  const [notified, setNotified] = useState(false);

  return (
    <div className="w-full rounded-md border border-line bg-peach/50 p-4">
      <p className="font-display font-bold text-ink">{t("product.soldOutKind")}</p>
      <button
        onClick={() => setNotified(true)}
        disabled={notified}
        className="mt-3 w-full rounded-full border-2 border-grape px-4 py-2.5 font-display font-bold text-grape transition hover:bg-grape hover:text-white disabled:opacity-60"
      >
        {notified ? t("product.restockPending") : "🔔 " + t("product.restock")}
      </button>
      <Link
        href={`/popups/${popupSlug}`}
        className="mt-2 block text-center text-sm text-concrete underline-offset-2 hover:underline"
      >
        {t("product.similar")} →
      </Link>
    </div>
  );
}
