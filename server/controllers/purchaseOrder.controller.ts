import type { Request, Response } from "express";
import {
    fetchPurchaseOrders,
    addPurchaseOrder,
    editPurchaseOrder,
    removePurchaseOrder,
} from "../services/purchaseOrder.service";

export async function getPurchaseOrders(_req: Request, res: Response): Promise<void> {
    try {
        const orders = await fetchPurchaseOrders();
        res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error("Failed to fetch purchase orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch purchase orders",
        });
    }
}

export async function createPurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
        const order = await addPurchaseOrder(req.body);
        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Failed to create purchase order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create purchase order",
        });
    }
}

export async function updatePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
        const order = await editPurchaseOrder(req.params.id, req.body);
        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Failed to update purchase order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update purchase order",
        });
    }
}

export async function deletePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
        await removePurchaseOrder(req.params.id);
        res.json({
            success: true,
            message: "Purchase order deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete purchase order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete purchase order",
        });
    }
}
