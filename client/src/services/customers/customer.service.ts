import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";

import { db } from "../../config/firebase";
import type { Customer } from "../../types/erp";

const customersCollection = collection(db, "customers");

export type CreateCustomerInput = Omit<Customer, "id" | "createdAt">;

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export async function getCustomers(): Promise<Customer[]> {
    const snapshot = await getDocs(customersCollection);

    return snapshot.docs.map((customerDoc) => {
        const data = customerDoc.data();

        let createdAt = "";

        if (data.createdAt instanceof Timestamp) {
            createdAt = data.createdAt.toDate().toISOString().split("T")[0];
        } else if (typeof data.createdAt === "string") {
            createdAt = data.createdAt;
        }

        return {
            ...data,
            id: customerDoc.id,
            createdAt,
        } as Customer;
    });
}

export async function createCustomer(
    customer: CreateCustomerInput
): Promise<string> {
    const customerRef = await addDoc(customersCollection, {
        ...customer,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return customerRef.id;
}

export async function updateCustomer(
    customerId: string,
    customer: UpdateCustomerInput
): Promise<void> {
    const customerRef = doc(db, "customers", customerId);

    await updateDoc(customerRef, {
        ...customer,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteCustomer(
    customerId: string
): Promise<void> {
    const customerRef = doc(db, "customers", customerId);

    await deleteDoc(customerRef);
}