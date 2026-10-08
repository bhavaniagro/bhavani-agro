import { Request, Response } from "express";
import * as documentService from "../services/document.service";

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
