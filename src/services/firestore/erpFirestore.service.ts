import {
    collection,
    doc,
    getDocs,
    setDoc,
} from "firebase/firestore";

import { db } from "../../config/firebase";

export async function loadCollection<T>(
    collectionName: string
): Promise<T[]> {
    const snapshot = await getDocs(
        collection(db, collectionName)
    );

    return snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
    })) as T[];
}

export async function saveCollection<T extends { id: string }>(
    collectionName: string,
    items: T[]
): Promise<void> {
    await Promise.all(
        items.map((item) =>
            setDoc(
                doc(db, collectionName, item.id),
                item,
                { merge: true }
            )
        )
    );

}
// Save or update one ERP document in Firebase Firestore
export async function saveDocument<T extends { id: string }>(
    collectionName: string,
    item: T
): Promise<void> {
    await setDoc(
        doc(db, collectionName, item.id),
        item,
        { merge: true }
    );
}