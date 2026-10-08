import * as stockMovementRepo from "../repositories/stockMovement.repository";

export async function fetchAllStockMovements() {
    return await stockMovementRepo.getAllStockMovements();
}

export async function addStockMovement(data: Record<string, unknown>) {
    return await stockMovementRepo.createStockMovement(data);
}

export async function editStockMovement(id: string, data: Record<string, unknown>) {
    return await stockMovementRepo.updateStockMovement(id, data);
}

export async function removeStockMovement(id: string) {
    return await stockMovementRepo.deleteStockMovement(id);
}
