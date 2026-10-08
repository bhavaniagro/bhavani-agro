import { Request, Response } from "express";
import * as employeeService from "../services/employee.service";

export async function getEmployees(req: Request, res: Response): Promise<void> {
    try {
        const employees = await employeeService.fetchEmployees();
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function createEmployee(req: Request, res: Response): Promise<void> {
    try {
        const employee = await employeeService.addEmployee(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function updateEmployee(req: Request, res: Response): Promise<void> {
    try {
        const employee = await employeeService.editEmployee(req.params.id, req.body);
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
        const result = await employeeService.removeEmployee(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}
