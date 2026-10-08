import { Request, Response } from "express";
import * as qcInspectionService from "../services/qcInspection.service";

export async function getQCInspections(_req: Request, res: Response): Promise<void> {
    try {
        const inspections = await qcInspectionService.fetchAllQCInspections();
        res.json(inspections);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createQCInspection(req: Request, res: Response): Promise<void> {
    try {
        const result = await qcInspectionService.addQCInspection(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateQCInspection(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await qcInspectionService.editQCInspection(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteQCInspection(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await qcInspectionService.removeQCInspection(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
