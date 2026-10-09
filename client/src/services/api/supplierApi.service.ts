import type { Supplier } from "../../types/erp";
import { API_BASE_URL } from "../../config/apiConfig";

export async function getSuppliersFromApi(): Promise<Supplier[]> {
    const response = await fetch(`${API_BASE_URL}/suppliers`);
    if (!response.ok) throw new Error("Failed to fetch suppliers");
    const result = await response.json();
    return result.data;
}

export async function createSupplierFromApi(supplier: Partial<Supplier>): Promise<Supplier> {
    const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplier),
    });
    if (!response.ok) throw new Error("Failed to create supplier");
    const result = await response.json();
    return result.data;
}

export async function updateSupplierFromApi(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplier),
    });
    if (!response.ok) throw new Error("Failed to update supplier");
    const result = await response.json();
    return result.data;
}

export async function deleteSupplierFromApi(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete supplier");
}
