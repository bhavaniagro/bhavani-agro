import { db } from "../config/firebase";

const stockMovementsCollection = db.collection("stockMovements");

export async function getAllStockMovements() {
    const snapshot = await stockMovementsCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createStockMovement(data: Record<string, unknown>) {
    const docRef = data.id
        ? stockMovementsCollection.doc(String(data.id))
        : stockMovementsCollection.doc();

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

export async function updateStockMovement(id: string, data: Record<string, unknown>) {
    const docRef = stockMovementsCollection.doc(id);
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

export async function deleteStockMovement(id: string) {
    await stockMovementsCollection.doc(id).delete();
    return { success: true, id };
}
