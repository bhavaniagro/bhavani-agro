import { db } from "../config/firebase";

const productsCollection = db.collection("products");

export async function getAllProducts() {
    const snapshot = await productsCollection.get();
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            currentStockMT: typeof data.currentStockMT === 'number' ? data.currentStockMT : (Number(data.currentStockMT) || 0),
            reservedStockMT: typeof data.reservedStockMT === 'number' ? data.reservedStockMT : (Number(data.reservedStockMT) || 0),
        };
    });
}

export async function createProduct(data: Record<string, unknown>) {
    const docRef = data.id
        ? productsCollection.doc(String(data.id))
        : productsCollection.doc();

    const payload = {
        ...data,
        id: docRef.id,
        currentStockMT: typeof data.currentStockMT === 'number' ? data.currentStockMT : (Number(data.currentStockMT) || 0),
        reservedStockMT: typeof data.reservedStockMT === 'number' ? data.reservedStockMT : (Number(data.reservedStockMT) || 0),
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

export async function updateProduct(id: string, data: Record<string, unknown>) {
    const productRef = productsCollection.doc(id);
    const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: new Date(),
    };
    if (data.currentStockMT !== undefined) {
        updateData.currentStockMT = typeof data.currentStockMT === 'number' ? data.currentStockMT : (Number(data.currentStockMT) || 0);
    }
    if (data.reservedStockMT !== undefined) {
        updateData.reservedStockMT = typeof data.reservedStockMT === 'number' ? data.reservedStockMT : (Number(data.reservedStockMT) || 0);
    }
    await productRef.set(updateData, { merge: true });
    const updatedDoc = await productRef.get();

    return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
    };
}

export async function deleteProduct(id: string): Promise<void> {
    await productsCollection.doc(id).delete();
}
