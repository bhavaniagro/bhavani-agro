import { Request, Response } from "express";
import * as stockMovementService from "../services/stockMovement.service";

export async function getStockMovements(_req: Request, res: Response): Promise<void> {
    try {
        const movements = await stockMovementService.fetchAllStockMovements();
        res.json(movements);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createStockMovement(req: Request, res: Response): Promise<void> {
    try {
        const result = await stockMovementService.addStockMovement(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateStockMovement(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await stockMovementService.editStockMovement(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteStockMovement(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await stockMovementService.removeStockMovement(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
