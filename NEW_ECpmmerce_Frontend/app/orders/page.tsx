"use client"

import type React from "react"

import { useState } from "react"
import { checkOrderStatus } from "@/lib/api-client"
import { Loader } from "lucide-react"
import styles from "./page.module.css"

export default function OrdersPage() {
  const [orderId, setOrderId] = useState("")
  const [phone, setPhone] = useState("")
  const [orderStatus, setOrderStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrderStatus(null)

    try {
      const response = await checkOrderStatus(orderId, phone)
      if (response.success || response.data) {
        setOrderStatus(response.data)
      } else {
        setError(response.error || "Order not found")
      }
    } catch (err) {
      setError("Failed to fetch order status")
      console.error(err)
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Track Your Order</h1>
        <p className={styles.subtitle}>Enter your order ID and phone number to check the status</p>

        <form onSubmit={handleSearch} className={styles.form}>
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label>Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                placeholder="ORD123"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+923001234567"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading && <Loader className={styles.loaderIcon} />}
              {loading ? "Searching..." : "Track Order"}
            </button>
          </div>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {searched && orderStatus && (
          <div className={styles.orderStatus}>
            <h2 className={styles.orderStatusTitle}>Order Status</h2>
            <div className={styles.orderStatusDetails}>
              <div>
                <p>Order ID</p>
                <p>{orderStatus.id}</p>
              </div>
              <div>
                <p>Status</p>
                <p style={{ textTransform: "capitalize" }}>{orderStatus.status}</p>
              </div>
              <div>
                <p>Total Amount</p>
                <p>PKR {orderStatus.totalAmount?.toLocaleString()}</p>
              </div>
              {orderStatus.estimatedDelivery && (
                <div>
                  <p>Estimated Delivery</p>
                  <p>{orderStatus.estimatedDelivery}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {searched && !orderStatus && !error && (
          <div className={styles.emptyState}>
            <p>No order found with the provided details</p>
          </div>
        )}
      </div>
    </div>
  )
}
