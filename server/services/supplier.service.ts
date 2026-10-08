import {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from "../repositories/supplier.repository";

export async function fetchSuppliers() {
    return getAllSuppliers();
}

export async function addSupplier(data: Record<string, unknown>) {
    return createSupplier(data);
}

export async function editSupplier(id: string, data: Record<string, unknown>) {
    return updateSupplier(id, data);
}

export async function removeSupplier(id: string): Promise<void> {
    return deleteSupplier(id);
}
