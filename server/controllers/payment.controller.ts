import { Request, Response } from "express";
import * as paymentService from "../services/payment.service";

export async function getPayments(_req: Request, res: Response): Promise<void> {
    try {
        const payments = await paymentService.fetchAllPayments();
        res.json(payments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createPayment(req: Request, res: Response): Promise<void> {
    try {
        const result = await paymentService.addPayment(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updatePayment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await paymentService.editPayment(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deletePayment(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await paymentService.removePayment(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
