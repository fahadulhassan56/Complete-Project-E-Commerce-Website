"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/admin-nav"
import { Loader } from "lucide-react"
import styles from "./page.module.css"

export default function AdminDashboard() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin")
    } else {
      setToken(adminToken)
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className={styles.loader}>
        <Loader className={styles.loaderIcon} />
      </div>
    )
  }

  if (!token) {
    return null
  }

  return (
    <div className={styles.container}>
      <AdminNav token={token} />
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome to your admin dashboard. Use the navigation to manage your store.</p>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardLabel}>Total Products</h3>
              <p className={styles.cardValue}>-</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardLabel}>Total Orders</h3>
              <p className={styles.cardValue}>-</p>
            </div>
            <div className={styles.card}>
              <h3 className={styles.cardLabel}>Total Revenue</h3>
              <p className={styles.cardValue}>PKR 0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
