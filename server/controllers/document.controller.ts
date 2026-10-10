import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import * as documentService from "../services/document.service";
import { getUploadsDir } from "../config/upload";

export async function getDocuments(req: Request, res: Response): Promise<void> {
    try {
        const documents = await documentService.fetchDocuments();
        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function createDocument(req: Request, res: Response): Promise<void> {
    try {
        const document = await documentService.addDocument(req.body);
        res.status(201).json({ success: true, data: document });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function updateDocument(req: Request, res: Response): Promise<void> {
    try {
        const document = await documentService.editDocument(req.params.id, req.body);
        res.status(200).json({ success: true, data: document });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function deleteDocument(req: Request, res: Response): Promise<void> {
    try {
        const result = await documentService.removeDocument(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function uploadDocumentFile(req: Request, res: Response): Promise<void> {
    try {
        const { fileName, fileData } = req.body;
        if (!fileName || !fileData) {
            res.status(400).json({ success: false, message: "fileName and fileData are required" });
            return;
        }

        const matches = fileData.match(/^data:(.+);base64,(.+)$/);
        let buffer: Buffer;
        if (matches) {
            buffer = Buffer.from(matches[2], "base64");
        } else {
            buffer = Buffer.from(fileData, "base64");
        }

        const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const uploadsDir = getUploadsDir();
        const filePath = path.join(uploadsDir, safeName);
        fs.writeFileSync(filePath, buffer);

        const protocol = req.protocol;
        const host = req.get("host") || "localhost:4000";
        const fileUrl = `${protocol}://${host}/uploads/${safeName}`;

        const sizeInKB = (buffer.length / 1024).toFixed(1);
        const fileSize = buffer.length > 1024 * 1024
            ? `${(buffer.length / (1024 * 1024)).toFixed(1)} MB`
            : `${sizeInKB} KB`;

        res.status(200).json({
            success: true,
            data: {
                fileUrl,
                fileName,
                fileSize,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}
