"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import styles from "./product-card.module.css"

interface ProductCardProps {
  product: {
    id: number
    title: string
    slug: string
    description: string
    images?: Array<{ url: string; altText?: string }>
    variants?: any[]
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map((v: any) => Number.parseFloat(v.price)))
    : 0

  const imageUrl = product.images?.[0]?.url || product.variants?.[0]?.imageUrl || "/placeholder.svg"

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.link}>
        <div>
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={product.images?.[0]?.altText || product.title}
              fill
              className={styles.image}
            />
          </div>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.description}>{product.description}</p>
          {minPrice > 0 && <p className={styles.price}>PKR {minPrice.toLocaleString()}</p>}
        </div>
      </Link>
      <Link href={`/products/${product.slug}`} className={styles.button}>
        <ShoppingCart className={styles.buttonIcon} />
        Shop Now
      </Link>
    </div>
  )
}
