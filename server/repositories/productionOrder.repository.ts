import { db } from "../config/firebase";

const productionOrdersCollection = db.collection("productionOrders");

export async function getAllProductionOrders() {
    const snapshot = await productionOrdersCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createProductionOrder(data: Record<string, unknown>) {
    const docRef = data.id
        ? productionOrdersCollection.doc(String(data.id))
        : productionOrdersCollection.doc();

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

export async function updateProductionOrder(id: string, data: Record<string, unknown>) {
    const docRef = productionOrdersCollection.doc(id);
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

export async function deleteProductionOrder(id: string) {
    await productionOrdersCollection.doc(id).delete();
    return { success: true, id };
}
