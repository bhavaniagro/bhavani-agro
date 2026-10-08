import type { SalesOrder } from "../../types/erp";

const API_BASE_URL = "http://localhost:4000/api";

export async function getSalesOrdersFromApi(): Promise<SalesOrder[]> {
    const response = await fetch(`${API_BASE_URL}/sales-orders`);
    if (!response.ok) throw new Error("Failed to fetch sales orders");
    const result = await response.json();
    return result.data;
}

export async function createSalesOrderFromApi(order: Partial<SalesOrder>): Promise<SalesOrder> {
    const response = await fetch(`${API_BASE_URL}/sales-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Failed to create sales order");
    const result = await response.json();
    return result.data;
}

export async function updateSalesOrderFromApi(id: string, order: Partial<SalesOrder>): Promise<SalesOrder> {
    const response = await fetch(`${API_BASE_URL}/sales-orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Failed to update sales order");
    const result = await response.json();
    return result.data;
}

export async function deleteSalesOrderFromApi(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/sales-orders/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete sales order");
}
