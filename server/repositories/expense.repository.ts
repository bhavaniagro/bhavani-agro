import { db } from "../config/firebase";

const expensesCollection = db.collection("expenses");

export async function getAllExpenses() {
    const snapshot = await expensesCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createExpense(data: Record<string, unknown>) {
    const docRef = data.id
        ? expensesCollection.doc(String(data.id))
        : expensesCollection.doc();

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

export async function updateExpense(id: string, data: Record<string, unknown>) {
    const docRef = expensesCollection.doc(id);
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

export async function deleteExpense(id: string) {
    await expensesCollection.doc(id).delete();
    return { success: true, id };
}
