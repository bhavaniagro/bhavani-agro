import type { FinishedProduct } from "../../types/erp";
import { API_BASE_URL } from "../../config/apiConfig";

export async function getProductsFromApi(): Promise<FinishedProduct[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    const result = await response.json();
    return result.data;
}

export async function createProductFromApi(product: Partial<FinishedProduct>): Promise<FinishedProduct> {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to create product");
    const result = await response.json();
    return result.data;
}

export async function updateProductFromApi(id: string, product: Partial<FinishedProduct>): Promise<FinishedProduct> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error("Failed to update product");
    const result = await response.json();
    return result.data;
}

export async function deleteProductFromApi(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
}
