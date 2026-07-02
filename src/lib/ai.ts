// Anthropic Claude 클라이언트 헬퍼. API 키는 환경변수에서만 읽는다(코드/깃에 노출 금지).
import Anthropic from "@anthropic-ai/sdk";

// 모델 선택 (06-tech-stack): 챗봇은 성능, 번역은 가볍고 저렴한 모델.
export const CHAT_MODEL = "claude-sonnet-5";
export const TRANSLATE_MODEL = "claude-haiku-4-5-20251001";

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}
