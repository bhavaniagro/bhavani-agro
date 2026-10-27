import type { Request, Response, NextFunction } from "express";

interface CacheEntry {
    data: any;
    timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();

export function getItemTimestamp(item: any): number {
    if (!item || typeof item !== "object") return 0;
    const ts = item.updatedAt || item.createdAt;
    if (!ts) return 0;
    if (typeof ts === "number") return ts;
    if (typeof ts === "string") {
        const parsed = new Date(ts).getTime();
        return isNaN(parsed) ? 0 : parsed;
    }
    if (ts instanceof Date) return ts.getTime();
    if (typeof ts.toDate === "function") return ts.toDate().getTime();
    if (typeof ts._seconds === "number") return ts._seconds * 1000;
    if (typeof ts.seconds === "number") return ts.seconds * 1000;
    return 0;
}

function getResourceBase(url: string): string {
    const cleanUrl = url.split("?")[0];
    const parts = cleanUrl.split("/").filter(Boolean);
    // e.g. parts for "/api/customers" => ['api', 'customers']
    // parts for "/api/customers/123" => ['api', 'customers', '123']
    if (parts.length >= 2) {
        return `/${parts[0]}/${parts[1]}`;
    }
    return cleanUrl;
}

export function apiCacheMiddleware(req: Request, res: Response, next: NextFunction): void {
    const originalUrl = req.originalUrl || req.url;
    const resourceBase = getResourceBase(originalUrl);
    const method = req.method.toUpperCase();

    // Skip health check, uploads, and cache management
    if (resourceBase === "/api/health" || resourceBase === "/api/cache" || resourceBase.startsWith("/uploads")) {
        next();
        return;
    }

    // Only cache top-level list GET endpoints (e.g. GET /api/customers, not /api/customers/id or /api/documents/download)
    const cleanPath = originalUrl.split("?")[0].replace(/\/+$/, "");
    const isListGet = method === "GET" && cleanPath === resourceBase;

    if (isListGet) {
        const cached = memoryCache.get(resourceBase);
        const since = req.query.since as string | undefined;

        if (cached) {
            if (since) {
                const sinceTime = new Date(since).getTime();
                if (!isNaN(sinceTime)) {
                    // Filter delta
                    if (Array.isArray(cached.data)) {
                        const filtered = cached.data.filter((item) => getItemTimestamp(item) > sinceTime);
                        res.json(filtered);
                        return;
                    } else if (cached.data && typeof cached.data === "object" && Array.isArray(cached.data.data)) {
                        const filtered = cached.data.data.filter((item: any) => getItemTimestamp(item) > sinceTime);
                        res.json({
                            ...cached.data,
                            data: filtered,
                        });
                        return;
                    }
                }
            }

            // Return full cached response with 0 Firestore reads
            res.json(cached.data);
            return;
        }

        // Cache miss: Intercept res.json to populate cache
        const originalJson = res.json.bind(res);
        res.json = (body: any) => {
            if (res.statusCode >= 200 && res.statusCode < 300 && body !== undefined) {
                memoryCache.set(resourceBase, {
                    data: body,
                    timestamp: Date.now(),
                });
            }
            return originalJson(body);
        };

        next();
        return;
    }

    // On mutations (POST, PUT, DELETE), intercept response to update or invalidate cache
    if (["POST", "PUT", "DELETE"].includes(method)) {
        const originalJson = res.json.bind(res);
        res.json = (body: any) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                handleMutationCacheUpdate(resourceBase, method, originalUrl, body);
            }
            return originalJson(body);
        };

        next();
        return;
    }

    next();
}

function handleMutationCacheUpdate(
    resourceBase: string,
    method: string,
    originalUrl: string,
    body: any
): void {
    const cached = memoryCache.get(resourceBase);
    if (!cached) return;

    let item = body;
    if (body && typeof body === "object" && "data" in body) {
        item = body.data;
    }

    if (method === "POST" && item && item.id) {
        if (Array.isArray(cached.data)) {
            cached.data = [item, ...cached.data.filter((i: any) => i.id !== item.id)];
        } else if (cached.data && Array.isArray(cached.data.data)) {
            cached.data.data = [item, ...cached.data.data.filter((i: any) => i.id !== item.id)];
        }
        cached.timestamp = Date.now();
    } else if (method === "PUT" && item && item.id) {
        if (Array.isArray(cached.data)) {
            cached.data = cached.data.map((i: any) => (i.id === item.id ? { ...i, ...item } : i));
        } else if (cached.data && Array.isArray(cached.data.data)) {
            cached.data.data = cached.data.data.map((i: any) => (i.id === item.id ? { ...i, ...item } : i));
        }
        cached.timestamp = Date.now();
    } else {
        // On DELETE or non-standard responses, invalidate resource cache so next GET fetches fresh
        memoryCache.delete(resourceBase);
    }
}

export function clearMemoryCache(): void {
    memoryCache.clear();
}
