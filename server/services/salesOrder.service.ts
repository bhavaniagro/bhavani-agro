import {
    getAllSalesOrders,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
} from "../repositories/salesOrder.repository";

export async function fetchSalesOrders() {
    return getAllSalesOrders();
}

export async function addSalesOrder(data: Record<string, unknown>) {
    return createSalesOrder(data);
}

export async function editSalesOrder(id: string, data: Record<string, unknown>) {
    return updateSalesOrder(id, data);
}

export async function removeSalesOrder(id: string): Promise<void> {
    return deleteSalesOrder(id);
}
