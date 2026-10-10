import { db } from "../config/firebase";

const customersCollection = db.collection("customers");

export async function getAllCustomers() {
    const snapshot = await customersCollection.get();

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createCustomer(data: Record<string, unknown>) {
    const docRef = data.id
        ? customersCollection.doc(String(data.id))
        : customersCollection.doc();

    const payload = {
        ...data,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await docRef.set(payload, { merge: true });
    const createdDoc = await docRef.get();

    return {
        id: createdDoc.id,
        ...createdDoc.data(),
    };
}

export async function updateCustomer(
    id: string,
    data: Record<string, unknown>
) {
    const customerRef = customersCollection.doc(id);

    await customerRef.set(
        {
            ...data,
            updatedAt: new Date(),
        },
        { merge: true }
    );

    const updatedDoc = await customerRef.get();

    return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
    };
}

export async function deleteCustomer(id: string): Promise<void> {
    await customersCollection.doc(id).delete();
}