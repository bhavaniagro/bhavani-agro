import {
    createCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
} from "../repositories/customer.repository";

export async function fetchCustomers() {
    return getAllCustomers();
}

export async function addCustomer(data: Record<string, unknown>) {
    return createCustomer(data);
}
export async function editCustomer(
    id: string,
    data: Record<string, unknown>
) {
    return updateCustomer(id, data);
}
export async function removeCustomer(id: string): Promise<void> {
    return deleteCustomer(id);
}