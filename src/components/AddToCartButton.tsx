"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart";
import { useI18n } from "./I18nProvider";

export function AddToCartButton({
  product,
}: {
  product: Omit<CartItem, "quantity">;
}) {
  const { add } = useCart();
  const { t } = useI18n();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        add(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="w-full rounded-full bg-coral-deep px-4 py-3.5 font-display font-bold text-white shadow-pop transition hover:-translate-y-0.5 active:translate-y-0"
    >
      {added ? "✓ " + t("nav.cart") : "🛒 " + t("product.addToCart")}
    </button>
  );
}
