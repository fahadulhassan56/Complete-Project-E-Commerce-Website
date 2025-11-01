"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/admin-nav"
import { getAdminCategories, createCategory } from "@/lib/api-client"
import { Loader, Plus } from "lucide-react"
import styles from "./page.module.css"

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  })

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin")
    } else {
      setToken(adminToken)
      fetchCategories(adminToken)
    }
  }, [router])

  const fetchCategories = async (adminToken: string) => {
    try {
      setLoading(true)
      const response = await getAdminCategories(adminToken)
      setCategories(response.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      await createCategory(token, formData)
      setFormData({ name: "", slug: "", description: "" })
      setShowForm(false)
      fetchCategories(token)
    } catch (err) {
      console.error(err)
    }
  }

  if (!token) return null

  return (
    <div className={styles.container}>
      <AdminNav token={token} />
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.header}>
            <h1 className={styles.title}>Categories</h1>
            <button
              onClick={() => {
                setShowForm(!showForm)
                setFormData({ name: "", slug: "", description: "" })
              }}
              className={styles.addButton}
            >
              <Plus />
              Add Category
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  Create
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
            <div className={styles.grid}>
              {categories.map((category) => (
                <div key={category.id} className={styles.card}>
                  <h3 className={styles.cardTitle}>{category.name}</h3>
                  <p className={styles.cardDescription}>{category.description}</p>
                  <p className={styles.cardSlug}>Slug: {category.slug}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
