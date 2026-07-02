// 카테고리 탐색(보조 경로) — 팝업이 아니라 굿즈 종류로 둘러보기.
import Link from "next/link";
import { getProducts } from "@/lib/queries";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/config";
import { ProductCard } from "@/components/ProductCard";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, locale] = await Promise.all([
    getProducts(category),
    getLocale(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">
        {translate(locale, "nav.shop")}
      </h1>

      {/* 카테고리 필터 칩 (지원: 타입별로 빨리 찾기) */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-full border px-4 py-2 font-display text-sm font-bold ${
            !category
              ? "border-ink bg-ink text-white"
              : "border-line bg-white text-concrete hover:border-ink hover:text-ink"
          }`}
        >
          {locale === "ko" ? "전체" : "All"}
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/shop?category=${c}`}
            className={`rounded-full border px-4 py-2 font-display text-sm font-bold ${
              category === c
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-concrete hover:border-ink hover:text-ink"
            }`}
          >
            {CATEGORY_LABELS[c][locale]}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} locale={locale} />
        ))}
      </div>
    </div>
  );
}
