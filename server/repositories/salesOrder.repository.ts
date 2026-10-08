import { db } from "../config/firebase";

const salesOrdersCollection = db.collection("salesOrders");

export async function getAllSalesOrders() {
    const snapshot = await salesOrdersCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createSalesOrder(data: Record<string, unknown>) {
    const docRef = data.id
        ? salesOrdersCollection.doc(String(data.id))
        : salesOrdersCollection.doc();

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

export async function updateSalesOrder(id: string, data: Record<string, unknown>) {
    const docRef = salesOrdersCollection.doc(id);
    await docRef.set(
        {
            ...data,
            updatedAt: new Date(),
        },
        { merge: true }
    );
    const updatedDoc = await docRef.get();

    return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
    };
}

export async function deleteSalesOrder(id: string): Promise<void> {
    await salesOrdersCollection.doc(id).delete();
}
