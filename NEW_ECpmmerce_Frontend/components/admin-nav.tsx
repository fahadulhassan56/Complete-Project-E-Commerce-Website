"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LogOut, Package, Tag, ShoppingCart } from "lucide-react"
import styles from "./admin-nav.module.css"

interface AdminNavProps {
  token: string
}

export default function AdminNav({ token }: AdminNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin")
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className={styles.nav}>
      <div className={styles.header}>
        <h2 className={styles.title}>ADMIN</h2>
      </div>

      <nav className={styles.menu}>
        <Link
          href="/admin/dashboard"
          className={`${styles.menuLink} ${isActive("/admin/dashboard") ? styles.menuLinkActive : ""}`}
        >
          <Package className={styles.menuIcon} />
          Dashboard
        </Link>

        <Link
          href="/admin/products"
          className={`${styles.menuLink} ${isActive("/admin/products") ? styles.menuLinkActive : ""}`}
        >
          <Package className={styles.menuIcon} />
          Products
        </Link>

        <Link
          href="/admin/categories"
          className={`${styles.menuLink} ${isActive("/admin/categories") ? styles.menuLinkActive : ""}`}
        >
          <Tag className={styles.menuIcon} />
          Categories
        </Link>

        <Link
          href="/admin/orders"
          className={`${styles.menuLink} ${isActive("/admin/orders") ? styles.menuLinkActive : ""}`}
        >
          <ShoppingCart className={styles.menuIcon} />
          Orders
        </Link>
      </nav>

      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogOut className={styles.menuIcon} />
          Logout
        </button>
      </div>
    </div>
  )
}
