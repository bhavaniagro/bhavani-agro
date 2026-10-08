import { db } from "../config/firebase";

const suppliersCollection = db.collection("suppliers");

export async function getAllSuppliers() {
    const snapshot = await suppliersCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createSupplier(data: Record<string, unknown>) {
    const docRef = data.id
        ? suppliersCollection.doc(String(data.id))
        : suppliersCollection.doc();

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

export async function updateSupplier(id: string, data: Record<string, unknown>) {
    const supplierRef = suppliersCollection.doc(id);
    await supplierRef.set(
        {
            ...data,
            updatedAt: new Date(),
        },
        { merge: true }
    );
    const updatedDoc = await supplierRef.get();

    return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
    };
}

export async function deleteSupplier(id: string): Promise<void> {
    await suppliersCollection.doc(id).delete();
}
