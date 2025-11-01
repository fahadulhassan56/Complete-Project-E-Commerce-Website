"use client"

import styles from "./category-filter.module.css"

interface CategoryFilterProps {
  categories: any[]
  selectedCategory: number | null
  onSelectCategory: (categoryId: number | null) => void
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Categories</h3>
      <div className={styles.buttonList}>
        <button
          onClick={() => onSelectCategory(null)}
          className={`${styles.button} ${selectedCategory === null ? styles.buttonActive : ""}`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`${styles.button} ${selectedCategory === category.id ? styles.buttonActive : ""}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
