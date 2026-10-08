import {
    getAllPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
} from "../repositories/purchaseOrder.repository";

export async function fetchPurchaseOrders() {
    return getAllPurchaseOrders();
}

export async function addPurchaseOrder(data: Record<string, unknown>) {
    return createPurchaseOrder(data);
}

export async function editPurchaseOrder(id: string, data: Record<string, unknown>) {
    return updatePurchaseOrder(id, data);
}

export async function removePurchaseOrder(id: string): Promise<void> {
    return deletePurchaseOrder(id);
}
