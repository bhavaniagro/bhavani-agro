import { Request, Response } from "express";
import * as productionBatchService from "../services/productionBatch.service";

export async function getProductionBatches(_req: Request, res: Response): Promise<void> {
    try {
        const batches = await productionBatchService.fetchAllProductionBatches();
        res.json(batches);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createProductionBatch(req: Request, res: Response): Promise<void> {
    try {
        const result = await productionBatchService.addProductionBatch(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateProductionBatch(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await productionBatchService.editProductionBatch(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteProductionBatch(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await productionBatchService.removeProductionBatch(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
