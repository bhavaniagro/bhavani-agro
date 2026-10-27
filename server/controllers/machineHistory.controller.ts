import { Request, Response } from "express";
import * as historyService from "../services/machineHistory.service";

export async function getMachineHistory(req: Request, res: Response): Promise<void> {
    try {
        const history = await historyService.fetchMachineHistory();
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function createMachineHistory(req: Request, res: Response): Promise<void> {
    try {
        const history = await historyService.addMachineHistory(req.body);
        res.status(201).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function deleteMachineHistory(req: Request, res: Response): Promise<void> {
    try {
        const result = await historyService.removeMachineHistory(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}
