"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  translate,
  type Locale,
  type MessageKey,
} from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  t: (key: MessageKey) => string;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  function setLocale(next: Locale) {
    setLocaleState(next);
    // 쿠키에 저장(1년) → 서버 컴포넌트도 같은 로케일로 렌더
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    // 서버 컴포넌트 콘텐츠(상품/팝업 언어)를 다시 렌더
    router.refresh();
  }

  const value: I18nContextValue = {
    locale,
    t: (key) => translate(locale, key),
    setLocale,
    toggleLocale: () => setLocale(locale === "ko" ? "en" : "ko"),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Provider 밖에서 호출되면 기본 로케일로 안전하게 폴백
    return {
      locale: DEFAULT_LOCALE,
      t: (key: MessageKey) => translate(DEFAULT_LOCALE, key),
      setLocale: () => {},
      toggleLocale: () => {},
    } satisfies I18nContextValue;
  }
  return ctx;
}
