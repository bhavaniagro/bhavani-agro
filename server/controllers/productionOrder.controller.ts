import { Request, Response } from "express";
import * as productionOrderService from "../services/productionOrder.service";

export async function getProductionOrders(_req: Request, res: Response): Promise<void> {
    try {
        const orders = await productionOrderService.fetchAllProductionOrders();
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createProductionOrder(req: Request, res: Response): Promise<void> {
    try {
        const result = await productionOrderService.addProductionOrder(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateProductionOrder(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await productionOrderService.editProductionOrder(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteProductionOrder(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await productionOrderService.removeProductionOrder(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
