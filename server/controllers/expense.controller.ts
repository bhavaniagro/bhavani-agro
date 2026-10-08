import { Request, Response } from "express";
import * as expenseService from "../services/expense.service";

export async function getExpenses(req: Request, res: Response): Promise<void> {
    try {
        const expenses = await expenseService.fetchExpenses();
        res.status(200).json({ success: true, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function createExpense(req: Request, res: Response): Promise<void> {
    try {
        const expense = await expenseService.addExpense(req.body);
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function updateExpense(req: Request, res: Response): Promise<void> {
    try {
        const expense = await expenseService.editExpense(req.params.id, req.body);
        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function deleteExpense(req: Request, res: Response): Promise<void> {
    try {
        const result = await expenseService.removeExpense(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}
