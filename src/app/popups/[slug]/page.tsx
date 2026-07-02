// S2 팝업 상세 — 팝업 소개 + 소속 굿즈 목록.
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPopupBySlug } from "@/lib/queries";
import { getLocale } from "@/lib/locale-server";
import { pick, translate } from "@/lib/i18n";
import {
  getPopupStatus,
  STATUS_LABELS,
  STATUS_BADGE_CLASS,
} from "@/lib/popup-status";
import { ProductCard } from "@/components/ProductCard";

export default async function PopupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [popup, locale] = await Promise.all([
    getPopupBySlug(slug),
    getLocale(),
  ]);

  if (!popup) notFound();

  const status = getPopupStatus(popup.startDate, popup.endDate);
  const name = pick(locale, popup.nameKo, popup.nameEn);
  const desc = pick(locale, popup.descriptionKo, popup.descriptionEn);
  const period = `${popup.startDate.toLocaleDateString()} ~ ${popup.endDate.toLocaleDateString()}`;

  return (
    <div>
      <Link href="/" className="text-sm text-concrete hover:text-ink">
        ← {translate(locale, "nav.home")}
      </Link>

      <section className="mt-3 rounded-lg bg-gradient-to-br from-peach via-lavender to-sky p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 font-display text-xs font-bold ${STATUS_BADGE_CLASS[status]}`}
          >
            {STATUS_LABELS[status][locale]}
          </span>
          <span className="text-xs text-concrete">{popup.brand}</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">
          {name}
        </h1>
        <p className="mt-2 text-ink-soft">{desc}</p>
        <p className="mt-3 text-sm text-concrete">
          {translate(locale, "popup.period")}: {period}
          {popup.location ? ` · ${popup.location}` : ""}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">
          {translate(locale, "popup.goods")}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {popup.products.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
