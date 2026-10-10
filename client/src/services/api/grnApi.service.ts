import type { GRN } from "../../types/erp";
import { API_BASE_URL } from "../../config/apiConfig";

export async function getGRNsFromApi(): Promise<GRN[]> {
    const response = await fetch(`${API_BASE_URL}/grns`);
    if (!response.ok) throw new Error("Failed to fetch GRNs");
    const result = await response.json();
    return result.data;
}

export async function createGRNFromApi(grn: Partial<GRN>): Promise<GRN> {
    const response = await fetch(`${API_BASE_URL}/grns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grn),
    });
    if (!response.ok) throw new Error("Failed to create GRN");
    const result = await response.json();
    return result.data;
}

export async function updateGRNFromApi(id: string, grn: Partial<GRN>): Promise<GRN> {
    const response = await fetch(`${API_BASE_URL}/grns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grn),
    });
    if (!response.ok) throw new Error("Failed to update GRN");
    const result = await response.json();
    return result.data;
}

export async function deleteGRNFromApi(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/grns/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete GRN");
}
