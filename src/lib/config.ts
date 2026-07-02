// 설정성 상수 (03-data-model: 배송비·환율은 테이블이 아니라 상수로 관리)

/** 배송 권역별 고정 배송비(원). 국가 → 권역 매핑은 regionForCountry 참고. */
export const SHIPPING_FEES_KRW = {
  KR: 3000, // 국내
  ASIA: 9000, // 아시아권
  OTHER: 18000, // 그 외 전 세계
} as const;

export type ShippingRegion = keyof typeof SHIPPING_FEES_KRW;

/** 국가 코드(대문자 2자리) → 배송 권역. MVP는 단순 매핑. */
const ASIA_COUNTRIES = new Set([
  "JP", "CN", "TW", "HK", "SG", "TH", "VN", "MY", "ID", "PH",
]);

export function regionForCountry(countryCode: string): ShippingRegion {
  const cc = countryCode.trim().toUpperCase();
  if (cc === "KR") return "KR";
  if (ASIA_COUNTRIES.has(cc)) return "ASIA";
  return "OTHER";
}

/** KRW → USD 고정 환산율(참고 표시용). 실제 환율 API는 2차. */
export const KRW_PER_USD = 1350;

/** 굿즈 카테고리 (SQLite에 enum이 없어 문자열 상수로 관리) */
export const CATEGORIES = [
  "KEYRING", "STICKER", "ECOBAG", "PHOTOCARD", "STAND", "ETC",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, { ko: string; en: string }> = {
  KEYRING: { ko: "키링", en: "Keyring" },
  STICKER: { ko: "스티커", en: "Sticker" },
  ECOBAG: { ko: "에코백", en: "Eco Bag" },
  PHOTOCARD: { ko: "포토카드", en: "Photocard" },
  STAND: { ko: "아크릴 스탠드", en: "Acrylic Stand" },
  ETC: { ko: "기타", en: "Etc" },
};
