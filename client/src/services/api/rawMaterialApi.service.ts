import type { RawMaterial } from "../../types/erp";
import { API_BASE_URL } from "../../config/apiConfig";

export async function getRawMaterialsFromApi(): Promise<RawMaterial[]> {
    const response = await fetch(`${API_BASE_URL}/raw-materials`);
    if (!response.ok) throw new Error("Failed to fetch raw materials");
    const result = await response.json();
    return result.data;
}

export async function createRawMaterialFromApi(material: Partial<RawMaterial>): Promise<RawMaterial> {
    const response = await fetch(`${API_BASE_URL}/raw-materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(material),
    });
    if (!response.ok) throw new Error("Failed to create raw material");
    const result = await response.json();
    return result.data;
}

export async function updateRawMaterialFromApi(id: string, material: Partial<RawMaterial>): Promise<RawMaterial> {
    const response = await fetch(`${API_BASE_URL}/raw-materials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(material),
    });
    if (!response.ok) throw new Error("Failed to update raw material");
    const result = await response.json();
    return result.data;
}

export async function deleteRawMaterialFromApi(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/raw-materials/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete raw material");
}
