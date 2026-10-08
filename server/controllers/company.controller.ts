import { Request, Response } from "express";
import * as companyService from "../services/company.service";

export async function getCompanyProfile(req: Request, res: Response): Promise<void> {
    try {
        const profile = await companyService.fetchCompanyProfile();
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

export async function updateCompanyProfile(req: Request, res: Response): Promise<void> {
    try {
        const profile = await companyService.editCompanyProfile(req.body);
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}
