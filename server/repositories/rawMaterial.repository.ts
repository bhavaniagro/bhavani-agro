import { db } from "../config/firebase";

const rawMaterialsCollection = db.collection("rawMaterials");

export async function getAllRawMaterials() {
    const snapshot = await rawMaterialsCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createRawMaterial(data: Record<string, unknown>) {
    const docRef = data.id
        ? rawMaterialsCollection.doc(String(data.id))
        : rawMaterialsCollection.doc();

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

export async function updateRawMaterial(id: string, data: Record<string, unknown>) {
    const rawMaterialRef = rawMaterialsCollection.doc(id);
    await rawMaterialRef.set(
        {
            ...data,
            updatedAt: new Date(),
        },
        { merge: true }
    );
    const updatedDoc = await rawMaterialRef.get();

    return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
    };
}

export async function deleteRawMaterial(id: string): Promise<void> {
    await rawMaterialsCollection.doc(id).delete();
}
