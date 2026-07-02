// Google Gemini 클라이언트 헬퍼. API 키는 환경변수에서만 읽는다(코드/깃에 노출 금지).
import { GoogleGenAI } from "@google/genai";

// 모델 선택 (06-tech-stack): 챗봇·번역 모두 빠르고 저렴한 Flash.
export const CHAT_MODEL = "gemini-2.5-flash";
export const TRANSLATE_MODEL = "gemini-2.5-flash";

export function hasApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

let client: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}
