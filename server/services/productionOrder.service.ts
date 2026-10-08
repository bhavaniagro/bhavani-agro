import * as productionOrderRepo from "../repositories/productionOrder.repository";

export async function fetchAllProductionOrders() {
    return await productionOrderRepo.getAllProductionOrders();
}

export async function addProductionOrder(data: Record<string, unknown>) {
    return await productionOrderRepo.createProductionOrder(data);
}

export async function editProductionOrder(id: string, data: Record<string, unknown>) {
    return await productionOrderRepo.updateProductionOrder(id, data);
}

export async function removeProductionOrder(id: string) {
    return await productionOrderRepo.deleteProductionOrder(id);
}
