const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://unwithering-nonexpediently-glynda.ngrok-free.dev"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

async function fetchAPI(url: string, options: RequestInit = {}) {
  try {
    console.log("[v0] Fetching:", url)
    const res = await fetch(url, {
      ...options,
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...options.headers,
      },
    })

    if (!res.ok) {
      console.error("[v0] API Error:", res.status, res.statusText)
      const errorData = await res.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error || `HTTP ${res.status}: ${res.statusText}`,
        data: null,
      }
    }

    const data = await res.json()
    console.log("[v0] API Success:", url, data)
    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error("[v0] Fetch Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch",
      data: null,
    }
  }
}

// Auth
export async function adminLogin(email: string, password: string) {
  return fetchAPI(`${API_BASE_URL}/api/admin/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

// Categories
export async function getCategories() {
  return fetchAPI(`${API_BASE_URL}/api/categories`)
}

export async function getAdminCategories(token: string) {
  return fetchAPI(`${API_BASE_URL}/api/admin/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createCategory(token: string, data: any) {
  return fetchAPI(`${API_BASE_URL}/api/admin/categories`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

// Products
export async function getProducts() {
  return fetchAPI(`${API_BASE_URL}/api/products`)
}

export async function getProductById(id: string | number) {
  return fetchAPI(`${API_BASE_URL}/api/products/${id}`)
}

export async function getAdminProducts(token: string) {
  return fetchAPI(`${API_BASE_URL}/api/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createProduct(token: string, data: any) {
  return fetchAPI(`${API_BASE_URL}/api/admin/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function updateProduct(token: string, id: string | number, data: any) {
  return fetchAPI(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(token: string, id: string | number) {
  return fetchAPI(`${API_BASE_URL}/api/admin/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
}

// Product Variants
export async function createVariant(token: string, productId: string | number, data: any) {
  return fetchAPI(`${API_BASE_URL}/api/admin/products/${productId}/variants`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
}

// Orders
export async function createOrder(data: any) {
  return fetchAPI(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function checkOrderStatus(orderId: string, phone: string) {
  return fetchAPI(`${API_BASE_URL}/api/orders/${orderId}/status?phone=${encodeURIComponent(phone)}`)
}

export async function getAdminOrders(token: string) {
  return fetchAPI(`${API_BASE_URL}/api/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function confirmOrder(token: string, orderId: string) {
  return fetchAPI(`${API_BASE_URL}/api/admin/orders/${orderId}/confirm`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function updateOrderStatus(token: string, orderId: string, status: string, orderNumber: string) {
  return fetchAPI(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status, orderNumber }),
  })
}
