import { db } from "../config/firebase";

const companyCollection = db.collection("company");

export async function getCompanyProfile() {
    const snapshot = await companyCollection.get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
    };
}

export async function updateCompanyProfile(data: Record<string, unknown>) {
    const docRef = data.id
        ? companyCollection.doc(String(data.id))
        : companyCollection.doc("profile");

    const payload = {
        ...data,
        id: docRef.id,
        updatedAt: new Date(),
    };

    await docRef.set(payload, { merge: true });
    const updatedDoc = await docRef.get();

    return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
    };
}
