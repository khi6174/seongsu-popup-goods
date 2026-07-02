"use client";

// S4 장바구니 — 담은 상품 확인 · 수량 변경 · 합계 · 주문하기.
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/components/I18nProvider";
import { pick } from "@/lib/i18n";
import { Price } from "@/components/Price";

export default function CartPage() {
  const { items, subtotalKrw, setQuantity, remove } = useCart();
  const { t, locale } = useI18n();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-5xl">🛒</p>
        <p className="mt-3 text-concrete">{t("cart.empty")}</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-coral-deep px-5 py-2.5 font-display text-sm font-bold text-white shadow-pop"
        >
          {t("cart.emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">
        {t("cart.title")}
      </h1>

      <ul className="mt-6 space-y-3">
        {items.map((i) => (
          <li
            key={i.productId}
            className="flex items-center gap-4 rounded-lg border border-line bg-white p-4 shadow-card"
          >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-lavender/50 text-2xl">
              {i.image.startsWith("/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={i.image}
                  alt={pick(locale, i.nameKo, i.nameEn)}
                  className="h-full w-full object-cover"
                />
              ) : (
                i.image
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-bold text-ink">
                {pick(locale, i.nameKo, i.nameEn)}
              </p>
              <Price krw={i.priceKrw} className="text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-concrete">{t("cart.qty")}</label>
              <input
                type="number"
                min={1}
                value={i.quantity}
                onChange={(e) => setQuantity(i.productId, Number(e.target.value))}
                className="w-16 rounded-md border border-line px-2 py-1 text-sm"
              />
            </div>
            <button
              onClick={() => remove(i.productId)}
              className="text-xs text-concrete hover:text-coral-deep"
            >
              {t("cart.remove")}
            </button>
          </li>
        ))}
      </ul>

      {/* 커머스 영역: 흰 카드 고대비 (Kenji) */}
      <div className="mt-6 rounded-lg border border-line bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-ink">
            {t("cart.subtotal")}
          </span>
          <Price krw={subtotalKrw} className="text-lg" />
        </div>
        <Link
          href="/checkout"
          className="mt-4 block rounded-full bg-coral-deep px-6 py-3.5 text-center font-display font-bold text-white shadow-pop transition hover:-translate-y-0.5"
        >
          {t("cart.checkout")} →
        </Link>
      </div>
    </div>
  );
}
