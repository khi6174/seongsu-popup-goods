"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useI18n } from "./I18nProvider";

export function Header() {
  const { t, locale, toggleLocale } = useI18n();
  const { count } = useCart();

  return (
    <div className="sticky top-0 z-40">
      {/* 신뢰 스트립 (Emma·Kenji: 낯선 해외 사이트여도 안심) */}
      <div className="bg-ink text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-4 py-1.5 text-[11px] font-semibold">
          <span>🏷️ {t("trust.official")}</span>
          <span className="opacity-60">·</span>
          <span>🌍 {t("trust.ships")} ✓</span>
          <span className="hidden opacity-60 sm:inline">·</span>
          <span className="hidden sm:inline">🔒 {t("trust.securePay")}</span>
        </div>
      </div>

      <header className="border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
          <Link
            href="/"
            className="whitespace-nowrap font-display text-lg font-extrabold text-ink"
          >
            🛍️ {t("brand.name")}
          </Link>

          <nav className="ml-2 hidden gap-4 font-display text-sm font-bold text-concrete sm:flex">
            <Link href="/" className="hover:text-ink">
              {t("nav.home")}
            </Link>
            <Link href="/#popups" className="hover:text-ink">
              {t("nav.popups")}
            </Link>
            <Link href="/shop" className="hover:text-ink">
              {t("nav.shop")}
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* 언어 전환 (Emma: 우상단 고정, 터치 충분히 크게) */}
            <button
              onClick={toggleLocale}
              className="flex h-11 items-center gap-1 rounded-full border border-line bg-white px-3 font-display text-sm font-bold text-ink shadow-card transition hover:-translate-y-0.5"
              aria-label="Switch language"
            >
              🌐 {locale === "ko" ? "EN" : "한국어"}
            </button>
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-lg shadow-card transition hover:-translate-y-0.5"
              aria-label={t("nav.cart")}
            >
              🛒
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral-deep px-1 font-display text-[11px] font-extrabold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
