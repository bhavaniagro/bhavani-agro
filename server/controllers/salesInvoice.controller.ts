import { Request, Response } from "express";
import * as salesInvoiceService from "../services/salesInvoice.service";

export async function getSalesInvoices(_req: Request, res: Response): Promise<void> {
    try {
        const invoices = await salesInvoiceService.fetchAllSalesInvoices();
        res.json(invoices);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createSalesInvoice(req: Request, res: Response): Promise<void> {
    try {
        const result = await salesInvoiceService.addSalesInvoice(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateSalesInvoice(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await salesInvoiceService.editSalesInvoice(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteSalesInvoice(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const result = await salesInvoiceService.removeSalesInvoice(id);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
