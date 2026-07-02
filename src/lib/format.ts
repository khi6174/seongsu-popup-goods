// 가격 표기 헬퍼. IA 규칙: 항상 KRW 기준 + USD 참고 환산을 함께 노출.
import { KRW_PER_USD } from "./config";

/** 12000 → "₩12,000" */
export function formatKrw(krw: number): string {
  return "₩" + krw.toLocaleString("ko-KR");
}

/** 12000 → "$8.89" (참고용 환산) */
export function formatUsd(krw: number): string {
  const usd = krw / KRW_PER_USD;
  return "$" + usd.toFixed(2);
}

/** 12000 → "₩12,000 ≈ $8.89" */
export function formatPrice(krw: number): string {
  return `${formatKrw(krw)} ≈ ${formatUsd(krw)}`;
}
