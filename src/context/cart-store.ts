import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  increment: (productId: string, color?: string, size?: string) => void;
  decrement: (productId: string, color?: string, size?: string) => void;
  clear: () => void;
  total: () => number;
};

function sameLine(a: CartItem, productId: string, color?: string, size?: string) {
  return a.productId === productId && a.color === color && a.size === size;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, item.productId, item.color, item.size));
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.color, item.size)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, color, size) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, color, size))
        })),
      increment: (productId, color, size) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, color, size) ? { ...i, quantity: i.quantity + 1 } : i
          )
        })),
      decrement: (productId, color, size) =>
        set((state) => ({
          items: state.items
            .map((i) => (sameLine(i, productId, color, size) ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0)
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    }),
    { name: "nemati-cart" }
  )
);
