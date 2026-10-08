import * as productionBatchRepo from "../repositories/productionBatch.repository";

export async function fetchAllProductionBatches() {
    return await productionBatchRepo.getAllProductionBatches();
}

export async function addProductionBatch(data: Record<string, unknown>) {
    return await productionBatchRepo.createProductionBatch(data);
}

export async function editProductionBatch(id: string, data: Record<string, unknown>) {
    return await productionBatchRepo.updateProductionBatch(id, data);
}

export async function removeProductionBatch(id: string) {
    return await productionBatchRepo.deleteProductionBatch(id);
}
