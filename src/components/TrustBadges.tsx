// 신뢰 배지 (정적 시각 요소). 페르소나 Emma·Kenji의 "믿고 사도 되겠다" 요구 반영.
// 순수 컴포넌트라 서버/클라이언트 어디서든 locale만 넘기면 됨.
import { translate, type Locale, type MessageKey } from "@/lib/i18n";

type BadgeKey = "official" | "ships" | "securePay";

const STYLE: Record<BadgeKey, string> = {
  official: "bg-peach text-ink",
  ships: "bg-mint text-trust",
  securePay: "bg-sky text-ink",
};
const ICON: Record<BadgeKey, string> = {
  official: "🏷️",
  ships: "🌍",
  securePay: "🔒",
};

export function TrustBadges({
  locale,
  only,
  className = "",
}: {
  locale: Locale;
  only?: BadgeKey[];
  className?: string;
}) {
  const keys = only ?? (["official", "ships", "securePay"] as BadgeKey[]);
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {keys.map((k) => (
        <span
          key={k}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-display text-xs font-bold ${STYLE[k]}`}
        >
          <span>{ICON[k]}</span>
          {translate(locale, `trust.${k}` as MessageKey)}
          {k === "ships" && " ✓"}
        </span>
      ))}
    </div>
  );
}
