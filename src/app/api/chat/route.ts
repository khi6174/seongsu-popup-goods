// AI 쇼핑 챗봇 (POST /api/chat) — 다국어. 실데이터(팝업/상품)를 컨텍스트로 주입해
// 환각 없이 실제 상품만 추천하게 한다. (G1, 06-tech-stack)
import { NextResponse } from "next/server";
import { getCatalogForContext } from "@/lib/queries";
import { getPopupStatus, STATUS_LABELS } from "@/lib/popup-status";
import { SHIPPING_FEES_KRW } from "@/lib/config";
import { getAnthropic, hasApiKey, CHAT_MODEL } from "@/lib/ai";

type ChatMessage = { role: "user" | "assistant"; content: string };

// 팝업/상품을 프롬프트에 넣을 텍스트로 변환
async function buildContext(locale: "ko" | "en"): Promise<string> {
  const popups = await getCatalogForContext();
  const lines = popups.map((p) => {
    const status = getPopupStatus(p.startDate, p.endDate);
    const goods = p.products
      .map(
        (g) =>
          `    - ${g.nameKo} / ${g.nameEn} (${g.category}, ₩${g.priceKrw}, ${
            g.stock > 0 ? "재고있음" : "품절"
          }, slug=${g.slug})`
      )
      .join("\n");
    return `- 팝업: ${p.nameKo} / ${p.nameEn} [${
      STATUS_LABELS[status][locale]
    }] (slug=${p.slug})\n${goods}`;
  });
  const shipping = `배송비(원): 국내(KR) ${SHIPPING_FEES_KRW.KR}, 아시아(ASIA) ${SHIPPING_FEES_KRW.ASIA}, 그 외(OTHER) ${SHIPPING_FEES_KRW.OTHER}. 해외배송 가능.`;
  return `${lines.join("\n")}\n\n${shipping}`;
}

export async function POST(req: Request) {
  const { messages, locale } = (await req.json()) as {
    messages: ChatMessage[];
    locale: "ko" | "en";
  };
  const lang = locale === "en" ? "en" : "ko";

  const context = await buildContext(lang);

  const systemPrompt = [
    "당신은 '성수 팝업 굿즈'라는 글로벌 쇼핑몰의 친절한 AI 쇼핑 도우미입니다.",
    "성수동 팝업스토어의 공식 굿즈를 다국어로 판매합니다.",
    lang === "en"
      ? "Always reply in English."
      : "항상 한국어로 답하세요.",
    "아래 '현재 카탈로그'에 있는 팝업과 상품만 추천/안내하세요. 목록에 없는 상품을 지어내지 마세요.",
    "품절 상품을 물어보면 같은 카테고리의 재고 있는 대체 상품을 추천하세요.",
    "해외배송 문의에는 배송비 정보를 활용해 답하세요.",
    "답변은 2~4문장으로 간결하게. 상품/팝업은 이름으로 언급하세요.",
    "",
    "=== 현재 카탈로그 ===",
    context,
  ].join("\n");

  // API 키가 없으면(학습 초기) 친절한 안내 메시지로 폴백
  if (!hasApiKey()) {
    const reply =
      lang === "en"
        ? "The AI helper isn't connected yet. Add ANTHROPIC_API_KEY to your .env to enable real answers. (Everything else works!)"
        : "아직 AI가 연결되지 않았어요. .env 파일에 ANTHROPIC_API_KEY를 넣으면 실제 답변이 작동합니다. (나머지 기능은 모두 동작해요!)";
    return NextResponse.json({ reply });
  }

  try {
    const anthropic = getAnthropic();
    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 400,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n");
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("chat error", err);
    return NextResponse.json({ error: "chat failed" }, { status: 500 });
  }
}
