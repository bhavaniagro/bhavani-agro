import dotenv from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from server directory and root directory
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

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

const getServiceAccount = (): Record<string, unknown> => {
    // 1. Check for individual environment variables
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        return {
            project_id: process.env.FIREBASE_PROJECT_ID,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        };
    }

    // 2. Check for FIREBASE_SERVICE_ACCOUNT_BASE64
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        try {
            const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8");
            const sa = JSON.parse(decoded);
            if (typeof sa.private_key === "string") {
                sa.private_key = sa.private_key.replace(/\\n/g, "\n");
            }
            return sa;
        } catch (err) {
            throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    // 3. Check for FIREBASE_SERVICE_ACCOUNT (JSON string)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            if (typeof sa.private_key === "string") {
                sa.private_key = sa.private_key.replace(/\\n/g, "\n");
            }
            return sa;
        } catch (err) {
            throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable as JSON: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    // 4. Fallback to json file path
    const serviceAccountPath = findServiceAccountPath();
    if (!serviceAccountPath) {
        throw new Error(
            "Firebase credentials not found. Please set FIREBASE_SERVICE_ACCOUNT or individual FIREBASE_* variables in .env, or place 'firebase-service-account.json' in the project root."
        );
    }

    const sa = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
    if (typeof sa.private_key === "string") {
        sa.private_key = sa.private_key.replace(/\\n/g, "\n");
    }
    return sa;
};

const serviceAccount = getServiceAccount();

const firebaseAdminApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccount),
        });

export const db = getFirestore(firebaseAdminApp);
export default firebaseAdminApp;
