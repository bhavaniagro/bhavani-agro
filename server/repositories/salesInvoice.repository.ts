import { db } from "../config/firebase";

const salesInvoicesCollection = db.collection("salesInvoices");

export async function getAllSalesInvoices() {
    const snapshot = await salesInvoicesCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createSalesInvoice(data: Record<string, unknown>) {
    const docRef = data.id
        ? salesInvoicesCollection.doc(String(data.id))
        : salesInvoicesCollection.doc();

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

export async function updateSalesInvoice(id: string, data: Record<string, unknown>) {
    const docRef = salesInvoicesCollection.doc(id);
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

export async function deleteSalesInvoice(id: string) {
    await salesInvoicesCollection.doc(id).delete();
    return { success: true, id };
}
