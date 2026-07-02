// 토스페이먼츠 연동 헬퍼.
// - 클라이언트 키: 브라우저에 노출되어도 되는 공개 키 → NEXT_PUBLIC_ 접두사로 주입.
// - 시크릿 키: 서버에서만 사용(결제 승인). 절대 클라이언트로 내보내지 않는다.
export const TOSS_CONFIRM_URL =
  "https://api.tosspayments.com/v1/payments/confirm";

/** 서버에 시크릿 키가 설정되어 있는지. 없으면 승인 불가(테스트 미설정 상태). */
export function hasTossSecret(): boolean {
  return Boolean(process.env.TOSS_SECRET_KEY);
}

/** 토스 API 인증 헤더: base64(시크릿키 + ":"). */
export function tossAuthHeader(): string {
  const secret = process.env.TOSS_SECRET_KEY ?? "";
  return "Basic " + Buffer.from(secret + ":").toString("base64");
}
