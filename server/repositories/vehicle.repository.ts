import { db } from "../config/firebase";

const vehiclesCollection = db.collection("vehicles");

export async function getAllVehicles() {
    const snapshot = await vehiclesCollection.get();
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function createVehicle(data: Record<string, unknown>) {
    const docRef = data.id
        ? vehiclesCollection.doc(String(data.id))
        : vehiclesCollection.doc();

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

export async function updateVehicle(id: string, data: Record<string, unknown>) {
    const docRef = vehiclesCollection.doc(id);
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

export async function deleteVehicle(id: string) {
    await vehiclesCollection.doc(id).delete();
    return { success: true, id };
}
