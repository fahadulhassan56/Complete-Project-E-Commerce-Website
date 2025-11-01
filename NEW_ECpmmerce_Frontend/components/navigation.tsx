"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { Menu, X, ShoppingCart } from "lucide-react";
import styles from "./navigation.module.css";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Zustand safe access (prevents undefined on hydration)
  const cartItems = useCart((state) => state?.getTotalItems?.() || 0);

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            TRENDORA
          </Link>

          {/* Desktop Menu */}
          <div className={styles.desktopMenu}>
            <Link href="/" className={styles.navLink}>
              SHOP NOW
            </Link>
            <Link href="/orders" className={styles.navLink}>
              TRACK YOUR ORDER
            </Link>
            {/* Hidden admin link */}
            <Link href="/admin" className={styles.navLink} style={{ display: "none" }}>
              Admin
            </Link>
          </div>

          {/* Cart & Menu Buttons */}
          <div className={styles.actions}>
            <Link href="/cart" className={styles.cartLink}>
              <ShoppingCart className={styles.cartIcon} />
              {cartItems > 0 && <span className={styles.cartBadge}>{cartItems}</span>}
            </Link>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setIsOpen((prev) => !prev)}
              className={styles.menuButton}
            >
              {isOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={styles.mobileMenu}>
            <Link href="/" className={styles.mobileMenuLink} onClick={() => setIsOpen(false)}>
              SHOP NOW
            </Link>
            <Link href="/orders" className={styles.mobileMenuLink} onClick={() => setIsOpen(false)}>
              TRACK YOUR ORDER
            </Link>
            <Link
              href="/admin"
              className={styles.mobileMenuLink}
              style={{ display: "none" }}
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
