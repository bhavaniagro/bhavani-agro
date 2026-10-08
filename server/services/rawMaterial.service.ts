import {
    getAllRawMaterials,
    createRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
} from "../repositories/rawMaterial.repository";

export async function fetchRawMaterials() {
    return getAllRawMaterials();
}

export async function addRawMaterial(data: Record<string, unknown>) {
    return createRawMaterial(data);
}

export async function editRawMaterial(id: string, data: Record<string, unknown>) {
    return updateRawMaterial(id, data);
}

export async function removeRawMaterial(id: string): Promise<void> {
    return deleteRawMaterial(id);
}
