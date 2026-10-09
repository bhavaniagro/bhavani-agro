import type { PurchaseOrder } from "../../types/erp";
import { API_BASE_URL } from "../../config/apiConfig";

export async function getPurchaseOrdersFromApi(): Promise<PurchaseOrder[]> {
    const response = await fetch(`${API_BASE_URL}/purchase-orders`);
    if (!response.ok) throw new Error("Failed to fetch purchase orders");
    const result = await response.json();
    return result.data;
}

export async function createPurchaseOrderFromApi(order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Failed to create purchase order");
    const result = await response.json();
    return result.data;
}

export async function updatePurchaseOrderFromApi(id: string, order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const response = await fetch(`${API_BASE_URL}/purchase-orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Failed to update purchase order");
    const result = await response.json();
    return result.data;
}

export async function deletePurchaseOrderFromApi(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/purchase-orders/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete purchase order");
}
