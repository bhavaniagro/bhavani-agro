import { db } from "../config/firebase";

const paymentsCollection = db.collection("payments");

export async function getAllPayments() {
    const snapshot = await paymentsCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createPayment(data: Record<string, unknown>) {
    const docRef = data.id
        ? paymentsCollection.doc(String(data.id))
        : paymentsCollection.doc();

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

export async function updatePayment(id: string, data: Record<string, unknown>) {
    const docRef = paymentsCollection.doc(id);
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

export async function deletePayment(id: string) {
    await paymentsCollection.doc(id).delete();
    return { success: true, id };
}
