// S6 주문 완료 — 주문번호 · 요약 확인.
import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderByNumber } from "@/lib/queries";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { Price } from "@/components/Price";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const [order, locale] = await Promise.all([
    getOrderByNumber(orderNumber),
    getLocale(),
  ]);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-lg text-center">
      {/* 완료 감성 (Playful): 파스텔 히어로 + 이모지 */}
      <div className="rounded-lg bg-gradient-to-br from-peach via-lavender to-sky p-8">
        <p className="text-5xl">🎉</p>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-ink">
          {translate(locale, "order.complete")}
        </h1>
        <p className="mt-2 text-ink-soft">{translate(locale, "order.thanks")}</p>
      </div>

      {/* 주문 요약 (Trust: 흰 카드 + 진한 잉크 테두리 + 총액만 강조) */}
      <div className="mt-6 rounded-md border-2 border-ink bg-white p-6 text-left shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-concrete">
              {translate(locale, "order.number")}
            </p>
            <p className="font-mono text-lg font-bold text-ink">
              {order.orderNumber}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 font-display text-xs font-bold text-trust">
            🌍 {order.shippingCountry} ✓
          </span>
        </div>

        <ul className="mt-4 border-y border-line">
          {order.items.map((it) => (
            <li
              key={it.id}
              className="flex justify-between border-b border-dashed border-line py-2.5 text-sm text-ink-soft last:border-b-0"
            >
              <span>
                {it.productNameSnapshot} × {it.quantity}
              </span>
              <Price krw={it.priceKrwSnapshot * it.quantity} />
            </li>
          ))}
        </ul>

        <div className="mt-3 text-sm text-concrete">
          <p>
            {translate(locale, "order.shipTo")}:{" "}
            <span className="font-semibold text-ink-soft">
              {order.ordererName}
            </span>{" "}
            · {order.shippingCountry}
          </p>
          <p className="mt-1">{order.shippingAddress}</p>
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t-2 border-ink pt-3.5">
          <span className="font-display text-base font-extrabold text-ink">
            {translate(locale, "order.total")}
          </span>
          <Price
            krw={order.totalKrw}
            tone="total"
            className="font-display text-2xl"
          />
        </div>
      </div>

      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-coral-deep px-6 py-3.5 font-display font-bold text-white shadow-pop transition hover:-translate-y-0.5"
      >
        {translate(locale, "order.backHome")}
      </Link>
    </div>
  );
}
