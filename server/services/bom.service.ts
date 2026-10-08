import * as bomRepo from "../repositories/bom.repository";

export async function fetchAllBOMs() {
    return await bomRepo.getAllBOMs();
}

export async function addBOM(data: Record<string, unknown>) {
    return await bomRepo.createBOM(data);
}

export async function editBOM(id: string, data: Record<string, unknown>) {
    return await bomRepo.updateBOM(id, data);
}

export async function removeBOM(id: string) {
    return await bomRepo.deleteBOM(id);
}
