import type { Lead } from "../../types/erp";

const API_BASE_URL = "http://localhost:4000/api";

export async function getLeadsFromApi(): Promise<Lead[]> {
    const response = await fetch(`${API_BASE_URL}/leads`);

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
        throw new Error("Failed to create lead");
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
        throw new Error("Failed to update lead");
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