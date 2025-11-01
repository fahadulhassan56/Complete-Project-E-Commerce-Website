"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/lib/cart-store"
import { createOrder } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader } from "lucide-react"
import styles from "./page.module.css"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    shippingAddress: "",
    paymentMethod: "cash_on_delivery",
  })

  const total = getTotalPrice()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          productId: item.productId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      }

      const response = await createOrder(orderData)

      if (response.success || response.data) {
        setSuccess(true)
        setOrderNumber(response.data?.orderNumber)
        clearCart()
        setTimeout(() => {
          router.push(`/order-confirmation?orderNumber=${response.data?.orderNumber}`)
        }, 2000)
      } else {
        setError(response.error || "Failed to create order")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContainer}>
          <h1 className={styles.emptyTitle}>Your Cart is Empty</h1>
          <Link href="/" className={styles.continueButton}>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successCard}>
            <h2 className={styles.successTitle}>Order Placed Successfully!</h2>
            <p className={styles.successOrderNumber}>Order Number: {orderNumber}</p>
            <p className={styles.successMessage}>Redirecting to confirmation page...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.grid}>
        {/* Checkout Form */}
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                placeholder="Ali Khan"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                placeholder="+923001234567"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Shipping Address</label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                required
                placeholder="Lahore, Pakistan"
              />
            </div>

            <div className={styles.paymentInfo}>
              <label>Payment Method</label>
              <p className={styles.paymentMethod}>Cash on Delivery</p>
              <p className={styles.paymentNote}>Pay when you receive your order</p>
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading && <Loader className={styles.loaderIcon} />}
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className={styles.summarySection}>
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item.productVariantId} className={styles.summaryItem}>
                  <span className={styles.summaryItemLabel}>
                    {item.title} x {item.quantity}
                  </span>
                  <span className={styles.summaryItemValue}>PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>PKR {total.toLocaleString()}</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span className={styles.summaryTotalAmount}>PKR {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
