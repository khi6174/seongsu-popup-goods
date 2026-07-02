// 팝업 상태는 저장하지 않고 '오늘 날짜 vs 기간'으로 계산한다 (03 설계 원칙).

export type PopupStatus = "OPEN" | "CLOSING_SOON" | "CLOSED" | "UPCOMING";

const DAY = 1000 * 60 * 60 * 24;

export function getPopupStatus(
  startDate: Date,
  endDate: Date,
  now: Date = new Date()
): PopupStatus {
  if (now < startDate) return "UPCOMING";
  if (now > endDate) return "CLOSED";
  // 종료 3일 이내면 마감 임박
  if (endDate.getTime() - now.getTime() <= 3 * DAY) return "CLOSING_SOON";
  return "OPEN";
}

export const STATUS_LABELS: Record<PopupStatus, { ko: string; en: string }> = {
  OPEN: { ko: "열림", en: "Open" },
  CLOSING_SOON: { ko: "마감 임박", en: "Closing soon" },
  CLOSED: { ko: "종료", en: "Ended" },
  UPCOMING: { ko: "오픈 예정", en: "Upcoming" },
};

/** 배지 색상(무드보드 토큰). 열림=민트/트러스트, 마감임박=써니, 종료=콘크리트. */
export const STATUS_BADGE_CLASS: Record<PopupStatus, string> = {
  OPEN: "bg-mint text-trust",
  CLOSING_SOON: "bg-sunny/25 text-ink",
  CLOSED: "bg-line text-concrete",
  UPCOMING: "bg-sky text-ink",
};
