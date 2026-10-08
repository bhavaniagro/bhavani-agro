import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";

const serviceAccountPath = path.resolve(
    process.cwd(),
    "firebase-service-account.json"
);

if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
        "Firebase service account file not found: firebase-service-account.json"
    );
}

const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf-8")
);

const firebaseAdminApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccount),
        });

export const db = getFirestore(firebaseAdminApp);
export default firebaseAdminApp;