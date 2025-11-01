"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/admin-nav"
import { getAdminProducts, createProduct, deleteProduct, getAdminCategories } from "@/lib/api-client"
import { Loader, Plus, Trash2 } from "lucide-react"
import styles from "./page.module.css"

interface Variant {
  sku: string
  price: number
  currency: string
  size: string
  color: string
  stock: number
  imageUrl: string
}

interface ProductImage {
  url: string
  altText: string
  position: number
}

interface ProductFormData {
  title: string
  slug: string
  description: string
  categoryId: number
  variants: Variant[]
  images: ProductImage[]
}

interface Category {
  id: number
  name: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    slug: "",
    description: "",
    categoryId: 1,
    variants: [
      {
        sku: "",
        price: 0,
        currency: "USD",
        size: "",
        color: "",
        stock: 0,
        imageUrl: "",
      },
    ],
    images: [
      {
        url: "",
        altText: "",
        position: 1,
      },
    ],
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin")
    } else {
      setToken(adminToken)
      fetchProducts(adminToken)
      fetchCategories(adminToken)
    }
  }, [router])

  const fetchProducts = async (adminToken: string) => {
    try {
      setLoading(true)
      const response = await getAdminProducts(adminToken)
      const productsList = response.data?.items || []
      setProducts(productsList)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async (adminToken: string) => {
    try {
      const response = await getAdminCategories(adminToken)
      const categoriesList = response.data || []
      setCategories(categoriesList)
    } catch (err) {
      console.error("Failed to fetch categories:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      setSubmitting(true)
      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        categoryId: formData.categoryId,
        variants: formData.variants.filter((v) => v.sku && v.price > 0),
        images: formData.images.filter((img) => img.url),
      }

      console.log("[v0] Creating product with payload:", payload)
      const response = await createProduct(token, payload)

      if (response.success) {
        setFormData({
          title: "",
          slug: "",
          description: "",
          categoryId: 1,
          variants: [
            {
              sku: "",
              price: 0,
              currency: "USD",
              size: "",
              color: "",
              stock: 0,
              imageUrl: "",
            },
          ],
          images: [
            {
              url: "",
              altText: "",
              position: 1,
            },
          ],
        })
        setShowForm(false)
        fetchProducts(token)
      } else {
        alert(`Error: ${response.error}`)
      }
    } catch (err) {
      console.error(err)
      alert("Failed to create product")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!token || !confirm("Are you sure?")) return
    try {
      await deleteProduct(token, id)
      fetchProducts(token)
    } catch (err) {
      console.error(err)
    }
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData({ ...formData, variants: newVariants })
  }

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          sku: "",
          price: 0,
          currency: "USD",
          size: "",
          color: "",
          stock: 0,
          imageUrl: "",
        },
      ],
    })
  }

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    })
  }

  const updateImage = (index: number, field: string, value: any) => {
    const newImages = [...formData.images]
    newImages[index] = { ...newImages[index], [field]: value }
    setFormData({ ...formData, images: newImages })
  }

  const addImage = () => {
    setFormData({
      ...formData,
      images: [
        ...formData.images,
        {
          url: "",
          altText: "",
          position: formData.images.length + 1,
        },
      ],
    })
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || `Category ${categoryId}`
  }

  if (!token) return null

  return (
    <div className={styles.container}>
      <AdminNav token={token} />
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.header}>
            <h1 className={styles.title}>Products</h1>
            <button
              onClick={() => {
                setShowForm(!showForm)
                setFormData({
                  title: "",
                  slug: "",
                  description: "",
                  categoryId: categories.length > 0 ? categories[0].id : 1,
                  variants: [
                    {
                      sku: "",
                      price: 0,
                      currency: "USD",
                      size: "",
                      color: "",
                      stock: 0,
                      imageUrl: "",
                    },
                  ],
                  images: [
                    {
                      url: "",
                      altText: "",
                      position: 1,
                    },
                  ],
                })
              }}
              className={styles.addButton}
            >
              <Plus />
              Add Product
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Basic Info */}
              <div className={styles.formSection}>
                <h2 className={styles.formSectionTitle}>Basic Information</h2>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: Number.parseInt(e.target.value) })}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variants */}
              <div className={styles.formSection}>
                <div className={styles.formSectionHeader}>
                  <h2 className={styles.formSectionTitle}>Variants</h2>
                  <button type="button" onClick={addVariant} className={styles.addItemButton}>
                    + Add Variant
                  </button>
                </div>
                {formData.variants.map((variant, idx) => (
                  <div key={idx} className={styles.variantItem}>
                    <div className={styles.variantGrid}>
                      <input
                        type="text"
                        placeholder="SKU"
                        value={variant.sku}
                        onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => updateVariant(idx, "price", Number.parseFloat(e.target.value))}
                      />
                      <input
                        type="text"
                        placeholder="Size"
                        value={variant.size}
                        onChange={(e) => updateVariant(idx, "size", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Color"
                        value={variant.color}
                        onChange={(e) => updateVariant(idx, "color", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={(e) => updateVariant(idx, "stock", Number.parseInt(e.target.value))}
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={variant.imageUrl}
                        onChange={(e) => updateVariant(idx, "imageUrl", e.target.value)}
                      />
                    </div>
                    {formData.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(idx)} className={styles.removeButton}>
                        Remove Variant
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Images */}
              <div className={styles.formSection}>
                <div className={styles.formSectionHeader}>
                  <h2 className={styles.formSectionTitle}>Images</h2>
                  <button type="button" onClick={addImage} className={styles.addItemButton}>
                    + Add Image
                  </button>
                </div>
                {formData.images.map((image, idx) => (
                  <div key={idx} className={styles.imageItem}>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={image.url}
                      onChange={(e) => updateImage(idx, "url", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Alt Text"
                      value={image.altText}
                      onChange={(e) => updateImage(idx, "altText", e.target.value)}
                    />
                    {formData.images.length > 1 && (
                      <button type="button" onClick={() => removeImage(idx)} className={styles.removeButton}>
                        Remove Image
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.formActions}>
                <button type="submit" disabled={submitting} className={styles.submitButton}>
                  {submitting ? "Creating..." : "Create Product"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className={styles.loader}>
              <Loader className={styles.loaderIcon} />
            </div>
          ) : (
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={styles.emptyState}>
                        No products yet. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{product.slug}</td>
                        <td>{getCategoryName(product.categoryId)}</td>
                        <td>
                          <button onClick={() => handleDelete(product.id)} className={styles.deleteButton}>
                            <Trash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
