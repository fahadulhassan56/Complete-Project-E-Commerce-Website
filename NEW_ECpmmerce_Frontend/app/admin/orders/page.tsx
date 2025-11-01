"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminNav from "@/components/admin-nav"
import { getAdminOrders, updateOrderStatus } from "@/lib/api-client"
import { Loader, AlertCircle } from "lucide-react"
import styles from "./page.module.css"

export default function AdminOrdersPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [updatedOrders, setUpdatedOrders] = useState<string[]>([]) // ✅ new state

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken")
    if (!adminToken) {
      router.push("/admin")
    } else {
      setToken(adminToken)
      fetchOrders(adminToken)
    }
  }, [router])

  const fetchOrders = async (adminToken: string) => {
    try {
      setLoading(true)
      const response = await getAdminOrders(adminToken)
      const ordersList = Array.isArray(response.data) ? response.data : response.data?.items || []
      setOrders(ordersList)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    setUpdatingOrderId(orderId)
    setSelectedStatus(currentStatus)
    setShowStatusModal(true)
  }

  const confirmStatusUpdate = async () => {
    if (!token || !updatingOrderId || !selectedStatus) return

    try {
      const order = orders.find((o) => o.id === updatingOrderId)
      const orderNumber =
        order?.orderNumber || `ORD-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${updatingOrderId}`

      await updateOrderStatus(token, updatingOrderId, selectedStatus, orderNumber)

      // ✅ Disable further updates for this order
      setUpdatedOrders((prev) => [...prev, updatingOrderId])

      setShowStatusModal(false)
      setUpdatingOrderId(null)
      setSelectedStatus("")
      fetchOrders(token)
    } catch (err) {
      console.error(err)
      alert("Failed to update order status")
    }
  }

  if (!token) return null

  return (
    <div className={styles.container}>
      <AdminNav token={token} />
      <div className={styles.content}>
        <div className={styles.contentInner}>
          <h1 className={styles.title}>Orders</h1>

          {loading ? (
            <div className={styles.loader}>
              <Loader className={styles.loaderIcon} />
            </div>
          ) : (
            <div className={styles.table}>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const isUpdated = updatedOrders.includes(order.id)
                    return (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 600 }}>{order.id}</td>
                        <td>{order.customerName}</td>
                        <td>{order.customerPhone}</td>
                        <td>
                          <span
                            className={`${styles.statusBadge} ${
                              order.status === "confirmed"
                                ? styles.statusConfirmed
                                : order.status === "cancelled"
                                  ? styles.statusCancelled
                                  : styles.statusPending
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>PKR {order.totalAmount?.toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() => handleUpdateStatus(order.id, order.status)}
                            className={styles.updateButton}
                            disabled={isUpdated} // ✅ disable button if already updated
                          >
                            <AlertCircle />
                            {isUpdated ? "Updated" : "Update Status"}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showStatusModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Update Order Status</h2>

            <div className={styles.modalFormGroup}>
              <label>Select Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">Choose a status...</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setUpdatingOrderId(null)
                  setSelectedStatus("")
                }}
                className={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button onClick={confirmStatusUpdate} disabled={!selectedStatus} className={styles.modalSubmitButton}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
