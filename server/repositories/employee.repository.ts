import { db } from "../config/firebase";

const employeesCollection = db.collection("employees");

export async function getAllEmployees() {
    const snapshot = await employeesCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createEmployee(data: Record<string, unknown>) {
    const docRef = data.id
        ? employeesCollection.doc(String(data.id))
        : employeesCollection.doc();

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

export async function updateEmployee(id: string, data: Record<string, unknown>) {
    const docRef = employeesCollection.doc(id);
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

export async function deleteEmployee(id: string) {
    await employeesCollection.doc(id).delete();
    return { success: true, id };
}
