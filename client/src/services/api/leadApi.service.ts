import type { Lead } from "../../types/erp";
import { API_BASE_URL } from "../../config/apiConfig";

export async function getLeadsFromApi(since?: string): Promise<Lead[]> {
    const url = since ? `${API_BASE_URL}/leads?since=${encodeURIComponent(since)}` : `${API_BASE_URL}/leads`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch leads");
    }

    const result: {
        success: boolean;
        data: Lead[];
    } = await response.json();

    return result.data;
}

export async function createLeadFromApi(
    lead: Omit<Lead, "id" | "createdAt">
): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}/leads`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create lead");
    }

    const result: {
        success: boolean;
        data: Lead;
    } = await response.json();

    return result.data;
}

export async function updateLeadFromApi(
    id: string,
    lead: Partial<Lead>
): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update lead");
    }

    const result: {
        success: boolean;
        data: Lead;
    } = await response.json();

    return result.data;
}

export async function deleteLeadFromApi(
    id: string
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete lead");
    }
}