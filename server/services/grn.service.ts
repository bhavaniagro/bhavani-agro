import {
    getAllGRNs,
    createGRN,
    updateGRN,
    deleteGRN,
} from "../repositories/grn.repository";

export async function fetchGRNs() {
    return getAllGRNs();
}

export async function addGRN(data: Record<string, unknown>) {
    return createGRN(data);
}

export async function editGRN(id: string, data: Record<string, unknown>) {
    return updateGRN(id, data);
}

export async function removeGRN(id: string): Promise<void> {
    return deleteGRN(id);
}
