import { db } from "../config/firebase";

const historyCollection = db.collection("machineStatusHistory");

export async function getAllMachineHistory() {
    const snapshot = await historyCollection.get();
    const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Array<{ id: string; changedAt: string; [key: string]: unknown }>;
    // Sort newest first in memory to avoid Firestore index requirement
    return docs.sort((a, b) => {
        const ta = a.changedAt ? new Date(a.changedAt).getTime() : 0;
        const tb = b.changedAt ? new Date(b.changedAt).getTime() : 0;
        return tb - ta;
    });
}

export async function createMachineHistory(data: Record<string, unknown>) {
    const docRef = historyCollection.doc();
    const payload = {
        ...data,
        id: docRef.id,
        createdAt: new Date(),
    };
    await docRef.set(payload);
    const createdDoc = await docRef.get();
    return {
        id: createdDoc.id,
        ...createdDoc.data(),
    };
}

export async function deleteMachineHistory(id: string) {
    await historyCollection.doc(id).delete();
    return { success: true, id };
}
