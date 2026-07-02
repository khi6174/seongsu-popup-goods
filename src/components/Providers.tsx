"use client";

// 클라이언트 전역 프로바이더 묶음: 언어(i18n) + 장바구니.
import { I18nProvider } from "./I18nProvider";
import { CartProvider } from "@/lib/cart";
import type { Locale } from "@/lib/i18n";

export function Providers({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <CartProvider>{children}</CartProvider>
    </I18nProvider>
  );
}
