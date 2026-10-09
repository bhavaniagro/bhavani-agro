import "dotenv/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const findServiceAccountPath = (): string | null => {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const customPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
        if (fs.existsSync(customPath)) return customPath;
    }

    const candidatePaths = [
        path.resolve(process.cwd(), "firebase-service-account.json"),
        path.resolve(process.cwd(), "..", "firebase-service-account.json"),
        path.resolve(__dirname, "..", "firebase-service-account.json"),
        path.resolve(__dirname, "../..", "firebase-service-account.json"),
    ];

    for (const candidate of candidatePaths) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    return null;
};

let serviceAccount: Record<string, unknown>;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch {
        throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable as JSON.");
    }
} else {
    const serviceAccountPath = findServiceAccountPath();

    if (!serviceAccountPath) {
        throw new Error(
            "Firebase service account file not found. Please place 'firebase-service-account.json' in the project root or server directory, or set FIREBASE_SERVICE_ACCOUNT_PATH in .env."
        );
    }

    serviceAccount = JSON.parse(
        fs.readFileSync(serviceAccountPath, "utf-8")
    );
}

const firebaseAdminApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccount),
        });

export const db = getFirestore(firebaseAdminApp);
export default firebaseAdminApp;