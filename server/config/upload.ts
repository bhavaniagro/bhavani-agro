import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const getUploadsDir = (): string => {
    try {
        let current = path.dirname(fileURLToPath(import.meta.url));
        while (current !== path.parse(current).root) {
            const pkgPath = path.join(current, "package.json");
            if (fs.existsSync(pkgPath)) {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
                if (pkg.name === "bhavani-agro-server") {
                    const uploadsDir = path.join(current, "uploads");
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    return uploadsDir;
                }
            }
            current = path.dirname(current);
        }
    } catch {
        // Fallback if import.meta.url fails or during bundling
    }

    const base = process.cwd().endsWith("server") 
        ? process.cwd() 
        : path.resolve(process.cwd(), "server");
    const uploadsDir = path.join(base, "uploads");
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    return uploadsDir;
};
