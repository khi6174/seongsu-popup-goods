// 가격 표기 — KRW(강조) + USD 참고 환산. (IA 규칙)
// tone="total": 총액 강조(코랄). 무드보드 "총액만 한 곳에 강조색" 규칙용.
import { formatKrw, formatUsd } from "@/lib/format";

export function Price({
  krw,
  className = "",
  tone = "default",
}: {
  krw: number;
  className?: string;
  tone?: "default" | "total";
}) {
  return (
    <span className={className}>
      <span
        className={`font-display font-extrabold ${
          tone === "total" ? "text-coral-deep" : "text-ink"
        }`}
      >
        {formatKrw(krw)}
      </span>
      <span className="text-sm font-semibold text-concrete">
        {" "}
        ≈ {formatUsd(krw)}
      </span>
    </span>
  );
}
