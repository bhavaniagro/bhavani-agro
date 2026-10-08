import type { Request, Response } from "express";
import {
    fetchRawMaterials,
    addRawMaterial,
    editRawMaterial,
    removeRawMaterial,
} from "../services/rawMaterial.service";

export async function getRawMaterials(_req: Request, res: Response): Promise<void> {
    try {
        const materials = await fetchRawMaterials();
        res.json({
            success: true,
            data: materials,
        });
    } catch (error) {
        console.error("Failed to fetch raw materials:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch raw materials",
        });
    }
}

export async function createRawMaterial(req: Request, res: Response): Promise<void> {
    try {
        const material = await addRawMaterial(req.body);
        res.status(201).json({
            success: true,
            data: material,
        });
    } catch (error) {
        console.error("Failed to create raw material:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create raw material",
        });
    }
}

export async function updateRawMaterial(req: Request, res: Response): Promise<void> {
    try {
        const material = await editRawMaterial(req.params.id, req.body);
        res.json({
            success: true,
            data: material,
        });
    } catch (error) {
        console.error("Failed to update raw material:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update raw material",
        });
    }
}

export async function deleteRawMaterial(req: Request, res: Response): Promise<void> {
    try {
        await removeRawMaterial(req.params.id);
        res.json({
            success: true,
            message: "Raw material deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete raw material:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete raw material",
        });
    }
}
