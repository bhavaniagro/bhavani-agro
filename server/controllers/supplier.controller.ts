import type { Request, Response } from "express";
import {
    fetchSuppliers,
    addSupplier,
    editSupplier,
    removeSupplier,
} from "../services/supplier.service";

export async function getSuppliers(_req: Request, res: Response): Promise<void> {
    try {
        const suppliers = await fetchSuppliers();
        res.json({
            success: true,
            data: suppliers,
        });
    } catch (error) {
        console.error("Failed to fetch suppliers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch suppliers",
        });
    }
}

export async function createSupplier(req: Request, res: Response): Promise<void> {
    try {
        const supplier = await addSupplier(req.body);
        res.status(201).json({
            success: true,
            data: supplier,
        });
    } catch (error) {
        console.error("Failed to create supplier:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create supplier",
        });
    }
}

export async function updateSupplier(req: Request, res: Response): Promise<void> {
    try {
        const supplier = await editSupplier(req.params.id, req.body);
        res.json({
            success: true,
            data: supplier,
        });
    } catch (error) {
        console.error("Failed to update supplier:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update supplier",
        });
    }
}

export async function deleteSupplier(req: Request, res: Response): Promise<void> {
    try {
        await removeSupplier(req.params.id);
        res.json({
            success: true,
            message: "Supplier deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete supplier:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete supplier",
        });
    }
}
