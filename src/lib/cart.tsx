"use client";

// 비회원 장바구니: 서버 저장 없이 브라우저 localStorage 에 보관 (03 설계).
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  nameKo: string;
  nameEn: string;
  priceKrw: number;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalKrw: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQuantity: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sk_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 최초 마운트 시 localStorage 에서 복원
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // 손상된 값은 무시
    }
    setLoaded(true);
  }, []);

  // 변경 시 저장
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotalKrw = items.reduce((n, i) => n + i.priceKrw * i.quantity, 0);
    return {
      items,
      count,
      subtotalKrw,
      add: (item, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((i) => i.productId === item.productId);
          if (found) {
            return prev.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + qty }
                : i
            );
          }
          return [...prev, { ...item, quantity: qty }];
        }),
      setQuantity: (productId, qty) =>
        setItems((prev) =>
          prev
            .map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.max(1, qty) }
                : i
            )
            .filter((i) => i.quantity > 0)
        ),
      remove: (productId) =>
        setItems((prev) => prev.filter((i) => i.productId !== productId)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
