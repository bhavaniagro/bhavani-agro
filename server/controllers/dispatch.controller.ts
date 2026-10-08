import { Request, Response } from "express";
import * as dispatchService from "../services/dispatch.service";

export async function getDispatches(_req: Request, res: Response): Promise<void> {
    try {
        const dispatches = await dispatchService.fetchAllDispatches();
        res.json(dispatches);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createDispatch(req: Request, res: Response): Promise<void> {
    try {
        const result = await dispatchService.addDispatch(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateDispatch(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await dispatchService.editDispatch(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteDispatch(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await dispatchService.removeDispatch(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
