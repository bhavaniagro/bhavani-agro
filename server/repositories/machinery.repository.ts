import { db } from "../config/firebase";

const machineryCollection = db.collection("machinery");

export async function getAllMachinery() {
    const snapshot = await machineryCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createMachinery(data: Record<string, unknown>) {
    const docRef = data.id
        ? machineryCollection.doc(String(data.id))
        : machineryCollection.doc();

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

export async function updateMachinery(id: string, data: Record<string, unknown>) {
    const docRef = machineryCollection.doc(id);
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

export async function deleteMachinery(id: string) {
    await machineryCollection.doc(id).delete();
    return { success: true, id };
}
