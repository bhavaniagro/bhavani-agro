import type { Request, Response } from "express";
import {
    fetchSalesOrders,
    addSalesOrder,
    editSalesOrder,
    removeSalesOrder,
} from "../services/salesOrder.service";

export async function getSalesOrders(_req: Request, res: Response): Promise<void> {
    try {
        const orders = await fetchSalesOrders();
        res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error("Failed to fetch sales orders:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch sales orders",
        });
    }
}

export async function createSalesOrder(req: Request, res: Response): Promise<void> {
    try {
        const order = await addSalesOrder(req.body);
        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Failed to create sales order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create sales order",
        });
    }
}

export async function updateSalesOrder(req: Request, res: Response): Promise<void> {
    try {
        const order = await editSalesOrder(req.params.id, req.body);
        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Failed to update sales order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update sales order",
        });
    }
}

export async function deleteSalesOrder(req: Request, res: Response): Promise<void> {
    try {
        await removeSalesOrder(req.params.id);
        res.json({
            success: true,
            message: "Sales order deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete sales order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete sales order",
        });
    }
}
