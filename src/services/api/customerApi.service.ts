import type { Customer } from "../../types/erp";

const API_BASE_URL = "http://localhost:4000/api";

export async function getCustomersFromApi(): Promise<Customer[]> {
    const response = await fetch(`${API_BASE_URL}/customers`);

    if (!response.ok) {
        throw new Error("Failed to fetch customers");
    }

    const result: {
        success: boolean;
        data: Customer[];
    } = await response.json();

    return result.data;
}

export async function createCustomerFromApi(
    customer: Omit<
        Customer,
        "id" | "code" | "totalSales" | "outstandingBalance" | "createdAt"
    >
): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
    });

    if (!response.ok) {
        throw new Error("Failed to create customer");
    }

    const result: {
        success: boolean;
        data: Customer;
    } = await response.json();

    return result.data;
}
export async function updateCustomerFromApi(
    id: string,
    customer: Partial<Customer>
): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
    });

    if (!response.ok) {
        throw new Error("Failed to update customer");
    }

    const result: {
        success: boolean;
        data: Customer;
    } = await response.json();

    return result.data;
}

export async function deleteCustomerFromApi(
    id: string
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete customer");
    }
}