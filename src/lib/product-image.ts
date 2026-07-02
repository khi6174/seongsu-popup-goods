// 이미지 자산이 아직 없으므로, 카테고리별 이모지 + 그라데이션으로 플레이스홀더를 만든다.
// 디자인 단계에서 실제 이미지로 교체 예정.

export function parseImages(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export const CATEGORY_EMOJI: Record<string, string> = {
  KEYRING: "🔑",
  STICKER: "✨",
  ECOBAG: "👜",
  PHOTOCARD: "🖼️",
  STAND: "🧸",
  ETC: "🎁",
};

// 무드보드 뮤트 파스텔 토큰(peach/lavender/mint/sky/cream)으로 통일.
// 카테고리별로 조합만 달리해 은은한 변주를 준다.
export const CATEGORY_GRADIENT: Record<string, string> = {
  KEYRING: "from-peach to-lavender",
  STICKER: "from-lavender to-sky",
  ECOBAG: "from-mint to-sky",
  PHOTOCARD: "from-sky to-lavender",
  STAND: "from-peach to-mint",
  ETC: "from-cream to-lavender",
};

// 상품 슬러그 → 실제 사진 경로(public/products/*). 없는 상품은 이모지 플레이스홀더로 폴백.
export const PRODUCT_IMAGE: Record<string, string> = {
  "cheese-cat-keyring": "/products/cheese-cat-keyring.jpg",
  "cheese-cat-sticker-pack": "/products/cheese-cat-sticker-pack.jpg",
  "cheese-cat-ecobag": "/products/cheese-cat-ecobag.jpg",
  "retro-sticker-sheet": "/products/retro-sticker-sheet.jpg",
  "retro-keyring": "/products/retro-keyring.jpg",
  "mint-bear-photocard": "/products/mint-bear-photocard.jpg",
  "mint-bear-stand": "/products/mint-bear-stand.jpg",
};

/** 상품 슬러그의 실제 사진 경로. 없으면 null(→ 이모지 플레이스홀더 사용). */
export function imageFor(slug: string): string | null {
  return PRODUCT_IMAGE[slug] ?? null;
}

// 팝업 슬러그 → 포스터 사진 경로(public/popups/*). 없으면 🎪 이모지 플레이스홀더로 폴백.
export const POPUP_POSTER: Record<string, string> = {
  "cheese-cat": "/popups/cheese-cat.jpg",
  "retro-stationery": "/popups/retro-stationery.jpg",
  "mint-bear": "/popups/mint-bear.jpg",
};

/** 팝업 슬러그의 포스터 사진 경로. 없으면 null. */
export function posterFor(slug: string): string | null {
  return POPUP_POSTER[slug] ?? null;
}

export function emojiFor(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🎁";
}

export function gradientFor(category: string): string {
  return CATEGORY_GRADIENT[category] ?? "from-cream to-lavender";
}
