"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import styles from "./page.module.css"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("orderNumber")

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <CheckCircle className={styles.icon} />
        <h1 className={styles.title}>Order Confirmed!</h1>
        <p className={styles.message}>
          Thank you for your order. We'll process it shortly and send you updates via SMS.
        </p>

        {orderNumber && (
          <div className={styles.orderNumberCard}>
            <p className={styles.orderNumberLabel}>Order Number (Use this to track your order)</p>
            <p className={styles.orderNumber}>{orderNumber}</p>
          </div>
        )}

        <div className={styles.actions}>
          <Link href="/orders" className={styles.trackButton}>
            Track Your Order
          </Link>
          <Link href="/" className={styles.continueButton}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
