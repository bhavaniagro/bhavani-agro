import { Request, Response } from "express";
import * as machineryService from "../services/machinery.service";

export async function getMachinery(req: Request, res: Response): Promise<void> {
    try {
        const machinery = await machineryService.fetchMachinery();
        res.status(200).json({ success: true, data: machinery });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function createMachinery(req: Request, res: Response): Promise<void> {
    try {
        const machinery = await machineryService.addMachinery(req.body);
        res.status(201).json({ success: true, data: machinery });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function updateMachinery(req: Request, res: Response): Promise<void> {
    try {
        const machinery = await machineryService.editMachinery(req.params.id, req.body);
        res.status(200).json({ success: true, data: machinery });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function deleteMachinery(req: Request, res: Response): Promise<void> {
    try {
        const result = await machineryService.removeMachinery(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}
