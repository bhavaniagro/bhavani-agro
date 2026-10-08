import { db } from "../config/firebase";

const documentsCollection = db.collection("documents");

export async function getAllDocuments() {
    const snapshot = await documentsCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createDocument(data: Record<string, unknown>) {
    const docRef = data.id
        ? documentsCollection.doc(String(data.id))
        : documentsCollection.doc();

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

export async function updateDocument(id: string, data: Record<string, unknown>) {
    const docRef = documentsCollection.doc(id);
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

export async function deleteDocument(id: string) {
    await documentsCollection.doc(id).delete();
    return { success: true, id };
}
