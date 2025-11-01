"use client";

import { useCart } from "@/lib/cart-store";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import styles from "./page.module.css";

type CartItem = {
  productVariantId?: string | number;
  id?: string | number;
  title?: string;
  imageUrl?: string;
  price?: number | string;
  quantity?: number;
  color?: string;
  size?: string;
};

export default function CartPage() {
  const {
    items = [],
    removeItem,
    updateQuantity,
    getTotalPrice,
  } = useCart() as unknown as {
    items: CartItem[];
    removeItem: (id: string | number) => void;
    updateQuantity: (id: string | number, qty: number) => void;
    getTotalPrice: () => number | undefined;
  };

  // ✅ Ensure total is always a number
  const rawTotal = getTotalPrice?.() ?? 0;
  const total = isNaN(Number(rawTotal)) ? 0 : Number(rawTotal);

  // ✅ Empty cart UI
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h1 className={styles.title}>Your Cart is Empty</h1>
        <p className={styles.emptyText}>Add some items to get started</p>
        <Link href="/" className={styles.continueButton}>
          Continue Shopping
        </Link>
      </div>
    );
  }
console.log("🧾 CART ITEMS:", items);
console.log("💰 Total:", getTotalPrice?.());

  // ✅ Main Cart Layout
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.grid}>
        {/* 🛒 Cart Items Section */}
        <div className={styles.itemsSection}>
          <div className={styles.itemsList}>
            {items.map((item, index) => {
              const productId = item?.productVariantId ?? item?.id ?? index;
              const priceNum = Number(item?.price) || 0;
              const quantity = item?.quantity ?? 1;

              return (
                <div key={productId} className={styles.cartItem}>
                  {/* Product Image */}
                  <div className={styles.itemImage}>
                    <Image
                      src={
                        item?.imageUrl ||
                        "/placeholder.svg?height=100&width=100&query=product"
                      }
                      alt={item?.title || "Product"}
                      width={100}
                      height={100}
                    />
                  </div>

                  {/* Product Details */}
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemTitle}>
                      {item?.title || "Untitled Product"}
                    </h3>
                    <p className={styles.itemVariant}>
                      {item?.color || "N/A"} - Size {item?.size || "N/A"}
                    </p>
                    <p className={styles.itemPrice}>
                      PKR {priceNum.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity + Delete Controls */}
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() =>
                          updateQuantity?.(productId, Math.max(1, quantity - 1))
                        }
                        className={styles.quantityButton}
                      >
                        <Minus />
                      </button>

                      <span className={styles.quantity}>{quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity?.(productId, quantity + 1)
                        }
                        className={styles.quantityButton}
                      >
                        <Plus />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem?.(productId)}
                      className={styles.deleteButton}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💰 Order Summary */}
        <div className={styles.summarySection}>
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>
                  PKR {total.toLocaleString()}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span className={styles.summaryValue}>PKR 0</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tax</span>
                <span className={styles.summaryValue}>PKR 0</span>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span className={styles.summaryTotalAmount}>
                PKR {total.toLocaleString()}
              </span>
            </div>

            <Link href="/checkout" className={styles.checkoutButton}>
              Proceed to Checkout
            </Link>

            <Link href="/" className={styles.continueShoppingButton}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
