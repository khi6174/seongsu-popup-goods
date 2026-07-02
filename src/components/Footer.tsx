"use client";

import { useI18n } from "./I18nProvider";
import { TrustBadges } from "./TrustBadges";

export function Footer() {
  const { t, locale } = useI18n();
  return (
    <footer className="mt-16 border-t border-line bg-lavender/50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-concrete">
        <p className="font-display text-base font-extrabold text-ink">
          🛍️ {t("brand.name")}
        </p>
        <p className="mt-1">{t("brand.tagline")}</p>
        <TrustBadges locale={locale} className="mt-4" />
        <p className="mt-4 text-xs text-concrete/80">
          학습용 프로젝트 · AI 루키 리그 · 모의 결제만 지원합니다.
        </p>
      </div>
    </footer>
  );
}
