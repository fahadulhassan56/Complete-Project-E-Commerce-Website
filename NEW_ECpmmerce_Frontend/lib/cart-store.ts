import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  productId: number
  productVariantId: number
  title: string
  price: number
  quantity: number
  size?: string
  color?: string
  imageUrl?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productVariantId: number) => void
  updateQuantity: (productVariantId: number, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // ✅ Add item safely (ensures price & quantity are numbers)
      addItem: (item) =>
        set((state) => {
          const safeItem = {
            ...item,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
          }

          const existing = state.items.find(
            (i) => i.productVariantId === safeItem.productVariantId
          )

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productVariantId === safeItem.productVariantId
                  ? { ...i, quantity: i.quantity + safeItem.quantity }
                  : i
              ),
            }
          }

          return { items: [...state.items, safeItem] }
        }),

      // ✅ Remove item
      removeItem: (productVariantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => i.productVariantId !== productVariantId
          ),
        })),

      // ✅ Update quantity safely
      updateQuantity: (productVariantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productVariantId === productVariantId
              ? { ...i, quantity: Math.max(1, Number(quantity) || 1) }
              : i
          ),
        })),

      // ✅ Clear cart
      clearCart: () => set({ items: [] }),

      // ✅ Total price with type safety
      getTotalPrice: () => {
        const state = get()
        return state.items.reduce((total, item) => {
          const price = Number(item.price) || 0
          const qty = Number(item.quantity) || 1
          return total + price * qty
        }, 0)
      },

      // ✅ Total items count
      getTotalItems: () => {
        const state = get()
        return state.items.reduce(
          (total, item) => total + (Number(item.quantity) || 0),
          0
        )
      },
    }),
    {
      name: "cart-storage",
      version: 2,
      migrate: (persistedState: any, version) => {
        if (!persistedState) return { items: [] }
        // ✅ Ensure numeric fields on rehydrate
        const fixedItems =
          persistedState.items?.map((item: any) => ({
            ...item,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
          })) || []
        return { ...persistedState, items: fixedItems }
      },
    }
  )
)
