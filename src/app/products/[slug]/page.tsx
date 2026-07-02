// S3 상품 상세 — 굿즈 정보/가격/설명 + 장바구니 담기(또는 다정한 품절 처리).
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/queries";
import { getLocale } from "@/lib/locale-server";
import { pick, translate } from "@/lib/i18n";
import { CATEGORY_LABELS, type Category } from "@/lib/config";
import { emojiFor, gradientFor } from "@/lib/product-image";
import { Price } from "@/components/Price";
import { AddToCartButton } from "@/components/AddToCartButton";
import { RestockButton } from "@/components/RestockButton";
import { TrustBadges } from "@/components/TrustBadges";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, locale] = await Promise.all([
    getProductBySlug(slug),
    getLocale(),
  ]);

  if (!product) notFound();

  const name = pick(locale, product.nameKo, product.nameEn);
  const desc = pick(locale, product.descriptionKo, product.descriptionEn);
  const catLabel =
    CATEGORY_LABELS[product.category as Category]?.[locale] ?? product.category;
  const soldOut = product.stock <= 0;

  return (
    <div>
      <Link
        href={`/popups/${product.popup.slug}`}
        className="text-sm text-concrete hover:text-ink"
      >
        ← {translate(locale, "product.backToPopup")}
      </Link>

      <div className="mt-3 grid gap-8 md:grid-cols-2">
        {/* 이미지 플레이스홀더 */}
        <div
          className={`flex h-72 items-center justify-center rounded-lg bg-gradient-to-br text-7xl ${gradientFor(
            product.category
          )}`}
        >
          {emojiFor(product.category)}
        </div>

        {/* 정보 */}
        <div className="flex flex-col">
          <p className="text-xs text-concrete">
            {pick(locale, product.popup.nameKo, product.popup.nameEn)}
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">
            {name}
          </h1>
          <div className="mt-3 text-xl">
            <Price krw={product.priceKrw} />
          </div>

          {/* 감성 영역: 상품 설명 (파스텔) */}
          <div className="mt-4 rounded-md bg-lavender/40 p-4 text-sm">
            <p className="font-display font-bold text-ink">
              {translate(locale, "product.description")}
            </p>
            <p className="mt-1 whitespace-pre-wrap text-ink-soft">{desc}</p>
            <p className="mt-3 text-xs text-concrete">
              {translate(locale, "product.category")}: {catLabel} ·{" "}
              🚚 {translate(locale, "product.estDelivery")}
            </p>
          </div>

          <TrustBadges
            locale={locale}
            only={["official", "ships"]}
            className="mt-4"
          />

          <div className="mt-auto pt-6">
            {soldOut ? (
              <RestockButton popupSlug={product.popup.slug} />
            ) : (
              <AddToCartButton
                product={{
                  productId: product.id,
                  slug: product.slug,
                  nameKo: product.nameKo,
                  nameEn: product.nameEn,
                  priceKrw: product.priceKrw,
                  image: emojiFor(product.category),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
