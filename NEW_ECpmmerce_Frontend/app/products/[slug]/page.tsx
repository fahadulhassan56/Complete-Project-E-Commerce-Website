"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/lib/api-client"
import { useCart } from "@/lib/cart-store"
import Image from "next/image"
import { Loader, Plus, Minus, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import styles from "./page.module.css"

export default function ProductPage() {
  const { slug } = useParams() as { slug: string } // ✅ use useParams() instead of params
  const [product, setProduct] = useState<any>(null)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const addItem = useCart((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productsRes = await getProducts()
        const productsList = Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data?.items || []
        const found = productsList.find((p: any) => p.slug === slug)
        if (found) {
          setProduct(found)
          if (found.variants?.length > 0) {
            setSelectedVariant(found.variants[0])
          }
        } else {
          setError("Product not found")
        }
      } catch (err) {
        setError("Failed to load product")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  const handleAddToCart = () => {
    if (!selectedVariant) return

    addItem({
      productId: product.id,
      productVariantId: selectedVariant.id,
      title: product.title,
      price: Number.parseFloat(selectedVariant.price),
      quantity,
      size: selectedVariant.size,
      color: selectedVariant.color,
      imageUrl: selectedVariant.imageUrl,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>
          <Loader className={styles.loaderIcon} />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p className={styles.errorText}>{error || "Product not found"}</p>
          <Link href="/" className={styles.errorLink}>
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Back to Products
      </Link>

      <div className={styles.grid}>
        {/* Image */}
        <div className={styles.imageContainer}>
          <Image
            src={selectedVariant?.imageUrl || "/placeholder.svg?height=500&width=500&query=product"}
            alt={product.title}
            width={500}
            height={500}
            className={styles.image}
          />
        </div>

        {/* Details */}
        <div className={styles.details}>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.description}>{product.description}</p>

          {selectedVariant && (
            <>
              <div className={styles.priceSection}>
                <p className={styles.price}>
                  PKR {Number.parseFloat(selectedVariant.price).toLocaleString()}
                </p>
                <p className={styles.stock}>
                  Stock: {selectedVariant.stock} available
                </p>
              </div>

              {/* Variant Selection */}
              <div className={styles.variantSection}>
                <h3 className={styles.variantTitle}>Select Variant</h3>
                <div className={styles.variantList}>
                  {product.variants?.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`${styles.variantButton} ${
                        selectedVariant.id === variant.id
                          ? styles.variantButtonActive
                          : ""
                      }`}
                    >
                      <div className={styles.variantName}>
                        {variant.color} - Size {variant.size}
                      </div>
                      <div className={styles.variantPrice}>
                        PKR {Number.parseFloat(variant.price).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className={styles.quantitySection}>
                <h3 className={styles.quantityTitle}>Quantity</h3>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.quantityButton}
                  >
                    <Minus />
                  </button>
                  <span className={styles.quantity}>{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(selectedVariant.stock, quantity + 1))
                    }
                    className={styles.quantityButton}
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className={styles.actions}>
                <button
                  onClick={handleAddToCart}
                  disabled={selectedVariant.stock === 0}
                  className={styles.addToCartButton}
                >
                  <ShoppingCart />
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </button>
                <Link href="/checkout" className={styles.checkoutLink}>
                  Go to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
