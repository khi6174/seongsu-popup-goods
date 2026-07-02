"use client";

// S5 체크아웃 — 비회원 주문 + 토스페이먼츠 실결제(테스트). 배송비는 국가 → 권역으로 미리보기.
import { useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/components/I18nProvider";
import { Price } from "@/components/Price";
import { TrustBadges } from "@/components/TrustBadges";
import { regionForCountry, SHIPPING_FEES_KRW } from "@/lib/config";

// 공개 클라이언트 키(브라우저 노출 OK). 없으면 결제 버튼이 안내 메시지를 띄운다.
const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

export default function CheckoutPage() {
  const { items, subtotalKrw } = useCart();
  const { t } = useI18n();

  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 배송비 미리보기 (국가 입력 시 실시간)
  const region = form.country ? regionForCountry(form.country) : null;
  const shippingFee = region ? SHIPPING_FEES_KRW[region] : 0;
  const total = subtotalKrw + shippingFee;

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function placeOrder() {
    if (!form.name || !form.email || !form.country || !form.address) {
      setError(t("checkout.required"));
      return;
    }
    if (!TOSS_CLIENT_KEY) {
      setError(t("checkout.notConfigured"));
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      // 1) 서버에 주문 준비(PENDING) → 서버가 확정한 금액·주문명 수령(금액 위변조 방지)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ordererName: form.name,
          ordererEmail: form.email,
          shippingCountry: form.country,
          shippingAddress: form.address,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "order failed");
      }
      const { orderNumber, amount, orderName } = await res.json();

      // 2) 토스 결제창 열기. 성공하면 토스가 successUrl 로 리다이렉트한다.
      const toss = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = toss.payment({ customerKey: ANONYMOUS });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: amount },
        orderId: orderNumber,
        orderName,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
        customerEmail: form.email,
        customerName: form.name,
      });
      // 여기 아래는 리다이렉트로 실행되지 않음(장바구니 비우기는 성공 페이지에서 처리).
    } catch (e) {
      // 사용자가 결제창을 닫거나(USER_CANCEL) 오류가 나면 여기로 온다.
      setError(e instanceof Error ? e.message : "결제를 진행할 수 없어요.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-concrete">{t("cart.empty")}</div>
    );
  }

  const field =
    "mt-1 w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-concrete focus:border-grape";

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-extrabold text-ink">
        {t("checkout.title")}
      </h1>

      {/* 배송 정보 입력 (Trust 영역: 흰 배경 · 또렷한 라벨) */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-ink-soft">
            {t("checkout.name")}
          </label>
          <input
            className={field}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink-soft">
            {t("checkout.email")}
          </label>
          <input
            className={field}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink-soft">
            {t("checkout.country")}
          </label>
          <input
            className={field}
            placeholder={t("checkout.countryHint")}
            value={form.country}
            onChange={(e) => update("country", e.target.value.toUpperCase())}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink-soft">
            {t("checkout.address")}
          </label>
          <textarea
            className={field}
            rows={2}
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>
      </div>

      {/* 금액 요약 (Trust: 흰 카드 + 진한 잉크 테두리 + 총액만 강조) */}
      <div className="mt-6 rounded-md border-2 border-ink bg-white p-5 shadow-card">
        {region && (
          <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 font-display text-xs font-bold text-trust">
            🌍 {t("trust.ships")} · {form.country} ✓
          </span>
        )}
        <div className="flex justify-between py-1.5 text-sm text-ink-soft">
          <span>{t("checkout.subtotal")}</span>
          <Price krw={subtotalKrw} />
        </div>
        <div className="flex justify-between py-1.5 text-sm text-ink-soft">
          <span>
            {t("checkout.shippingFee")}
            {region ? ` (${region})` : ""}
          </span>
          <Price krw={shippingFee} />
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t-2 border-ink pt-3.5">
          <span className="font-display text-base font-extrabold text-ink">
            {t("checkout.total")}
          </span>
          <Price krw={total} tone="total" className="font-display text-2xl" />
        </div>
        <p className="mt-3 text-xs font-bold text-trust">
          ✓ {t("checkout.noHiddenFees")}
        </p>
      </div>

      {error && (
        <p className="mt-3 rounded-md bg-peach px-3 py-2 text-sm font-semibold text-coral-deep">
          {error}
        </p>
      )}

      <button
        onClick={placeOrder}
        disabled={submitting}
        className="mt-4 w-full rounded-full bg-coral-deep px-6 py-3.5 font-display font-bold text-white shadow-pop transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
      >
        {submitting ? t("checkout.processing") : t("checkout.placeOrder")}
      </button>

      {/* 결제 수단 안내 (모의) + 학습용 안내 */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xl opacity-80">
        <span>💳</span>
        <span>🅿️</span>
        <span>🍎</span>
        <span>🟡</span>
      </div>
      <p className="mt-2 text-center text-xs text-concrete">
        {t("checkout.mockNote")}
      </p>
    </div>
  );
}
