"use client"

import { useEffect, useState } from "react"
import { getCategories, getProducts } from "@/lib/api-client"
import ProductCard from "@/components/product-card"
import CategoryFilter from "@/components/category-filter"
import { Loader, AlertCircle } from "lucide-react"
import styles from "./page.module.css"


export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [productsRes, categoriesRes] = await Promise.all([getProducts(), getCategories()])

        if (productsRes.success && productsRes.data) {
          const productsList = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.items || []
          setProducts(productsList)
        } else {
          setError(`Products: ${productsRes.error || "Failed to load"}`)
        }

        if (categoriesRes.success && categoriesRes.data) {
          const categoriesList = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data.items || []
          setCategories(categoriesList)
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load products"
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = selectedCategory ? products.filter((p) => p.categoryId === selectedCategory) : products

  return (
  <div className={styles.container}>
  {/* Header Section */}
  <div className={styles.header}>
    <h1 className={styles.title}>Discover Premium Fashion</h1>
    <p className={styles.subtitle}>
      Explore our curated collection of high-quality clothing and accessories
    </p>

    {/* Slider Section (separated) */}
    <div className={styles.slider}>
      <div className={styles.slides}>
        <div className={`${styles.slide} ${styles.active}`}>
           <img src="/images/slider1.jpg" alt="Slider 1" />
        </div>
        <div className={styles.slide}>
          <img src="/images/slider2.jpg" alt="Slider 2" />
        </div>
        <div className={styles.slide}>
          <img src="/images/slider3.jpg" alt="Slider 3" />
        </div>
      </div>
      <div className={styles.overlay}>
        <h2 className={styles.sliderTitle}>Exclusive Deals</h2>
        <p className={styles.sliderSubtitle}>
          Check out our trending collections every week!
        </p>
      </div>
    </div>
  </div>

  {/* Grid Layout */}
  <div className={styles.grid}>
    {/* Sidebar */}
    <div className={styles.sidebar}>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </div>

    {/* Products Grid */}
    <div className={styles.content}>
      {loading ? (
        <div className={styles.loader}>
          <Loader className={styles.loaderIcon} />
        </div>
      ) : error ? (
        <div className={styles.error}>
          <div className={styles.errorHeader}>
            <AlertCircle className={styles.errorIcon} />
            <p className={styles.errorTitle}>Connection Error</p>
          </div>
          <p className={styles.errorMessage}>{error}</p>
          <p className={styles.errorDetails}>
            Make sure your backend is running at:{" "}
            {process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No products available yet</p>
          <p className={styles.emptySubtitle}>
            Check back soon for new items!
          </p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  </div>
</div>


  )
}
