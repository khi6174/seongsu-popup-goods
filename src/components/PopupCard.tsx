// 팝업 카드 (서버 컴포넌트). 홈에서 사용.
import Link from "next/link";
import { pick, translate, type Locale } from "@/lib/i18n";
import { getPopupStatus, STATUS_LABELS } from "@/lib/popup-status";
import { posterFor } from "@/lib/product-image";

type PopupCardData = {
  slug: string;
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  descriptionEn: string;
  brand: string;
  startDate: Date;
  endDate: Date;
};

// 상태 배지 스타일 (무드보드: 열림=민트/트러스트, 마감임박=써니, 종료=콘크리트)
const BADGE: Record<string, string> = {
  OPEN: "bg-mint text-trust",
  CLOSING_SOON: "bg-sunny/25 text-ink",
  CLOSED: "bg-line text-concrete",
  UPCOMING: "bg-sky text-ink",
};

// 카드 상단 파스텔 배경 로테이션
const BG = ["bg-peach", "bg-lavender", "bg-sky", "bg-mint"];

export function PopupCard({
  popup,
  locale,
  index = 0,
}: {
  popup: PopupCardData;
  locale: Locale;
  index?: number;
}) {
  const status = getPopupStatus(popup.startDate, popup.endDate);
  const name = pick(locale, popup.nameKo, popup.nameEn);
  const desc = pick(locale, popup.descriptionKo, popup.descriptionEn);
  const poster = posterFor(popup.slug);

  return (
    <Link
      href={`/popups/${popup.slug}`}
      className="group block overflow-hidden rounded-lg border border-line bg-white shadow-card transition duration-150 hover:-translate-y-1 hover:shadow-float"
    >
      <div className="relative h-40 overflow-hidden">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full items-center justify-center text-5xl ${BG[index % BG.length]}`}
          >
            🎪
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 font-display text-xs font-bold ${BADGE[status]}`}
          >
            {STATUS_LABELS[status][locale]}
          </span>
          <span className="text-xs text-concrete">{popup.brand}</span>
        </div>
        <h3 className="font-display text-base font-bold text-ink group-hover:text-coral-deep">
          {name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-concrete">{desc}</p>
        <p className="mt-3 font-display text-sm font-bold text-coral-deep">
          {translate(locale, "home.viewGoods")} →
        </p>
      </div>
    </Link>
  );
}
