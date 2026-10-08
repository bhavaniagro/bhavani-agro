import { db } from "../config/firebase";

const productionBatchesCollection = db.collection("productionBatches");

export async function getAllProductionBatches() {
    const snapshot = await productionBatchesCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createProductionBatch(data: Record<string, unknown>) {
    const docRef = data.id
        ? productionBatchesCollection.doc(String(data.id))
        : productionBatchesCollection.doc();

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

export async function updateProductionBatch(id: string, data: Record<string, unknown>) {
    const docRef = productionBatchesCollection.doc(id);
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

export async function deleteProductionBatch(id: string) {
    await productionBatchesCollection.doc(id).delete();
    return { success: true, id };
}
