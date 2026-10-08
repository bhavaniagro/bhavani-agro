import { db } from "../config/firebase";

const grnsCollection = db.collection("grns");

export async function getAllGRNs() {
    const snapshot = await grnsCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createGRN(data: Record<string, unknown>) {
    const docRef = data.id
        ? grnsCollection.doc(String(data.id))
        : grnsCollection.doc();

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

export async function updateGRN(id: string, data: Record<string, unknown>) {
    const docRef = grnsCollection.doc(id);
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

export async function deleteGRN(id: string): Promise<void> {
    await grnsCollection.doc(id).delete();
}
