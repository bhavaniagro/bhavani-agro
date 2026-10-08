import type { Request, Response } from "express";
import {
    fetchGRNs,
    addGRN,
    editGRN,
    removeGRN,
} from "../services/grn.service";

export async function getGRNs(_req: Request, res: Response): Promise<void> {
    try {
        const grns = await fetchGRNs();
        res.json({
            success: true,
            data: grns,
        });
    } catch (error) {
        console.error("Failed to fetch GRNs:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch GRNs",
        });
    }
}

export async function createGRN(req: Request, res: Response): Promise<void> {
    try {
        const grn = await addGRN(req.body);
        res.status(201).json({
            success: true,
            data: grn,
        });
    } catch (error) {
        console.error("Failed to create GRN:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create GRN",
        });
    }
}

export async function updateGRN(req: Request, res: Response): Promise<void> {
    try {
        const grn = await editGRN(req.params.id, req.body);
        res.json({
            success: true,
            data: grn,
        });
    } catch (error) {
        console.error("Failed to update GRN:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update GRN",
        });
    }
}

export async function deleteGRN(req: Request, res: Response): Promise<void> {
    try {
        await removeGRN(req.params.id);
        res.json({
            success: true,
            message: "GRN deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete GRN:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete GRN",
        });
    }
}
