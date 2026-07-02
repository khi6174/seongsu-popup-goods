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

export function emojiFor(category: string): string {
  return CATEGORY_EMOJI[category] ?? "🎁";
}

export function gradientFor(category: string): string {
  return CATEGORY_GRADIENT[category] ?? "from-cream to-lavender";
}
