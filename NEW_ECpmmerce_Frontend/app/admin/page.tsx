"use client"

import type React from "react"

import { useState } from "react"
import { adminLogin } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"
import styles from "./page.module.css"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await adminLogin(email, password)

      if (response.success || response.data?.token) {
        const token = response.data?.token
        localStorage.setItem("adminToken", token)
        router.push("/admin/dashboard")
      } else {
        setError(response.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>ADMIN LOGIN</h1>
          <p className={styles.subtitle}>Sign in to access the admin dashboard</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Admin Email"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter Password"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading && <Loader className={styles.loaderIcon} />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
