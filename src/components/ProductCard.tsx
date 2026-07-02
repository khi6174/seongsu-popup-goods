// 상품 카드 (서버 컴포넌트) — 스티커풍. 팝업 상세·카테고리 목록에서 사용.
import Link from "next/link";
import { pick, translate, type Locale } from "@/lib/i18n";
import { Price } from "./Price";
import { emojiFor, gradientFor, imageFor } from "@/lib/product-image";

type ProductCardData = {
  slug: string;
  nameKo: string;
  nameEn: string;
  category: string;
  priceKrw: number;
  stock: number;
};

export function ProductCard({
  product,
  locale,
}: {
  product: ProductCardData;
  locale: Locale;
}) {
  const name = pick(locale, product.nameKo, product.nameEn);
  const soldOut = product.stock <= 0;
  const img = imageFor(product.slug);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-line bg-white shadow-card transition duration-150 hover:-translate-y-1 hover:shadow-float"
    >
      <div className="relative h-36 overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={name}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
              soldOut ? "opacity-80 saturate-[.85]" : ""
            }`}
          />
        ) : (
          <div
            className={`flex h-full items-center justify-center bg-gradient-to-br text-5xl ${gradientFor(
              product.category
            )}`}
          >
            <span className="pc-keyring">{emojiFor(product.category)}</span>
          </div>
        )}
        {/* 하트(찜) 아이콘 — 스티커 감성 (지원 페르소나). hover 시 뿅. */}
        <span className="pc-heart absolute right-2.5 top-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-sm shadow-card">
          🤍
        </span>
        {soldOut && (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-0.5 font-display text-xs font-bold text-concrete">
            {translate(locale, "product.soldOut")}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-display text-sm font-bold text-ink group-hover:text-coral-deep">
          {name}
        </h3>
        <div className="mt-1">
          <Price krw={product.priceKrw} />
        </div>
      </div>
    </Link>
  );
}
