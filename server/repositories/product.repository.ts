import { db } from "../config/firebase";

const productsCollection = db.collection("products");

export async function getAllProducts() {
    const snapshot = await productsCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createProduct(data: Record<string, unknown>) {
    const docRef = data.id
        ? productsCollection.doc(String(data.id))
        : productsCollection.doc();

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

export async function updateProduct(id: string, data: Record<string, unknown>) {
    const productRef = productsCollection.doc(id);
    await productRef.set(
        {
            ...data,
            updatedAt: new Date(),
        },
        { merge: true }
    );
    const updatedDoc = await productRef.get();

    return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
    };
}

export async function deleteProduct(id: string): Promise<void> {
    await productsCollection.doc(id).delete();
}
