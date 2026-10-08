import { db } from "../config/firebase";

const purchaseOrdersCollection = db.collection("purchaseOrders");

export async function getAllPurchaseOrders() {
    const snapshot = await purchaseOrdersCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createPurchaseOrder(data: Record<string, unknown>) {
    const docRef = data.id
        ? purchaseOrdersCollection.doc(String(data.id))
        : purchaseOrdersCollection.doc();

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

export async function updatePurchaseOrder(id: string, data: Record<string, unknown>) {
    const docRef = purchaseOrdersCollection.doc(id);
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

export async function deletePurchaseOrder(id: string): Promise<void> {
    await purchaseOrdersCollection.doc(id).delete();
}
