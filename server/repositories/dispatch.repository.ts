import { db } from "../config/firebase";

const dispatchesCollection = db.collection("dispatches");

export async function getAllDispatches() {
    const snapshot = await dispatchesCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createDispatch(data: Record<string, unknown>) {
    const docRef = data.id
        ? dispatchesCollection.doc(String(data.id))
        : dispatchesCollection.doc();

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

export async function updateDispatch(id: string, data: Record<string, unknown>) {
    const docRef = dispatchesCollection.doc(id);
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

export async function deleteDispatch(id: string) {
    await dispatchesCollection.doc(id).delete();
    return { success: true, id };
}
