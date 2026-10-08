import {
    getAllLeads,
    createLead,
    updateLead,
    deleteLead,
} from "../repositories/lead.repository";

export async function fetchLeads() {
    return getAllLeads();
}

export async function addLead(data: Record<string, unknown>) {
    return createLead(data);
}

export async function editLead(
    id: string,
    data: Record<string, unknown>
) {
    return updateLead(id, data);
}

export async function removeLead(id: string) {
    return deleteLead(id);
}