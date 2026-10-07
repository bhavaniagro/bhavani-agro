import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function testFirestoreConnection(): Promise<void> {
    try {
        const docRef = await addDoc(collection(db, "_connectionTests"), {
            message: "Bhavani Agro Firebase connection test",
            createdAt: serverTimestamp(),
        });

        console.log(
            "Firestore connection successful. Document ID:",
            docRef.id
        );
    } catch (error) {
        console.error("Firestore connection failed:", error);
        throw error;
    }
}