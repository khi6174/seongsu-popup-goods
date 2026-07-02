// 상품설명 자동 번역 (POST /api/translate) — 한글 → 영어. (보조 AI 기능)
// 브랜드가 한글 설명만 올렸을 때 영어 설명을 생성하는 용도.
import { NextResponse } from "next/server";
import { getAnthropic, hasApiKey, TRANSLATE_MODEL } from "@/lib/ai";

export async function POST(req: Request) {
  const { text } = (await req.json()) as { text?: string };
  if (!text || !text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  // API 키가 없으면 원문을 그대로 돌려줘 흐름이 끊기지 않게 한다.
  if (!hasApiKey()) {
    return NextResponse.json({ translation: text, note: "no-api-key" });
  }

  try {
    const anthropic = getAnthropic();
    const response = await anthropic.messages.create({
      model: TRANSLATE_MODEL,
      max_tokens: 500,
      system:
        "You are a translator for an e-commerce shop selling Korean pop-up store goods. Translate the Korean product description into natural, friendly English. Return ONLY the translation, with no quotes or extra words.",
      messages: [{ role: "user", content: text }],
    });
    const translation = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    return NextResponse.json({ translation });
  } catch (err) {
    console.error("translate error", err);
    return NextResponse.json({ error: "translate failed" }, { status: 500 });
  }
}
