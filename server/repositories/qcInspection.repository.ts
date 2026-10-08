import { db } from "../config/firebase";

const qcInspectionsCollection = db.collection("qcInspections");

export async function getAllQCInspections() {
    const snapshot = await qcInspectionsCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createQCInspection(data: Record<string, unknown>) {
    const docRef = data.id
        ? qcInspectionsCollection.doc(String(data.id))
        : qcInspectionsCollection.doc();

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

export async function updateQCInspection(id: string, data: Record<string, unknown>) {
    const docRef = qcInspectionsCollection.doc(id);
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

export async function deleteQCInspection(id: string) {
    await qcInspectionsCollection.doc(id).delete();
    return { success: true, id };
}
