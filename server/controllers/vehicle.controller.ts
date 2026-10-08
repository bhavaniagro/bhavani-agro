import { Request, Response } from "express";
import * as vehicleService from "../services/vehicle.service";

export async function getVehicles(_req: Request, res: Response): Promise<void> {
    try {
        const vehicles = await vehicleService.fetchAllVehicles();
        res.json(vehicles);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createVehicle(req: Request, res: Response): Promise<void> {
    try {
        const result = await vehicleService.addVehicle(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateVehicle(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await vehicleService.editVehicle(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteVehicle(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await vehicleService.removeVehicle(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
