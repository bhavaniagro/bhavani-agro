import { Request, Response } from "express";
import * as bomService from "../services/bom.service";

export async function getBOMs(_req: Request, res: Response): Promise<void> {
    try {
        const boms = await bomService.fetchAllBOMs();
        res.json(boms);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createBOM(req: Request, res: Response): Promise<void> {
    try {
        const result = await bomService.addBOM(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateBOM(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await bomService.editBOM(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteBOM(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await bomService.removeBOM(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
