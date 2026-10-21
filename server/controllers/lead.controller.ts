import type { Request, Response } from "express";
import {
    addLead,
    fetchLeads,
    editLead,
    removeLead,
} from "../services/lead.service";

export async function getLeads(
    _req: Request,
    res: Response
): Promise<void> {
    try {
        const leads = await fetchLeads();

        res.status(200).json({
            success: true,
            data: leads,
        });
    } catch (error) {
        console.error("Failed to fetch leads:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch leads",
        });
    }
}

export async function postLead(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { leadName, name, company, companyName, mobile, mobileNumber, productInterested, status, lostReason } = req.body;

        const effectiveName = (typeof leadName === 'string' ? leadName : typeof name === 'string' ? name : '').trim();
        const effectiveCompany = (typeof company === 'string' ? company : typeof companyName === 'string' ? companyName : '').trim();
        const effectiveMobile = (typeof mobile === 'string' ? mobile : typeof mobileNumber === 'string' ? mobileNumber : '').trim();
        const effectiveProduct = (typeof productInterested === 'string' ? productInterested : '').trim();

        if (!effectiveName) {
            res.status(400).json({
                success: false,
                message: "Name is required",
            });
            return;
        }

        if (!effectiveCompany) {
            res.status(400).json({
                success: false,
                message: "Company Name is required",
            });
            return;
        }

        if (!effectiveMobile) {
            res.status(400).json({
                success: false,
                message: "Mobile Number is required",
            });
            return;
        }

        if (!effectiveProduct) {
            res.status(400).json({
                success: false,
                message: "Product Interested is required",
            });
            return;
        }

        if (status === 'Lost' && (!lostReason || typeof lostReason !== 'string' || !lostReason.trim())) {
            res.status(400).json({
                success: false,
                message: "Lost Reason is required when stage is Lost",
            });
            return;
        }

        const lead = await addLead(req.body);

        res.status(201).json({
            success: true,
            data: lead,
        });
    } catch (error) {
        console.error("Failed to create lead:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create lead",
        });
    }
}
export async function updateLead(
    req: Request,
    res: Response
) {
    try {
        const { leadName, name, company, companyName, mobile, mobileNumber, productInterested, status, lostReason } = req.body;

        if (leadName !== undefined || name !== undefined) {
            const effectiveName = (typeof leadName === 'string' ? leadName : typeof name === 'string' ? name : '').trim();
            if (!effectiveName) {
                res.status(400).json({
                    success: false,
                    message: "Name cannot be empty",
                });
                return;
            }
        }

        if (company !== undefined || companyName !== undefined) {
            const effectiveCompany = (typeof company === 'string' ? company : typeof companyName === 'string' ? companyName : '').trim();
            if (!effectiveCompany) {
                res.status(400).json({
                    success: false,
                    message: "Company Name cannot be empty",
                });
                return;
            }
        }

        if (mobile !== undefined || mobileNumber !== undefined) {
            const effectiveMobile = (typeof mobile === 'string' ? mobile : typeof mobileNumber === 'string' ? mobileNumber : '').trim();
            if (!effectiveMobile) {
                res.status(400).json({
                    success: false,
                    message: "Mobile Number cannot be empty",
                });
                return;
            }
        }

        if (productInterested !== undefined) {
            const effectiveProduct = (typeof productInterested === 'string' ? productInterested : '').trim();
            if (!effectiveProduct) {
                res.status(400).json({
                    success: false,
                    message: "Product Interested cannot be empty",
                });
                return;
            }
        }

        if (status === 'Lost' && (lostReason !== undefined && (typeof lostReason !== 'string' || !lostReason.trim()))) {
            res.status(400).json({
                success: false,
                message: "Lost Reason is required when stage is Lost",
            });
            return;
        }

        const lead = await editLead(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            data: lead,
        });
    } catch (error) {
        console.error("Failed to update lead:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update lead",
        });
    }
}

export async function deleteLead(
    req: Request,
    res: Response
) {
    try {
        await removeLead(req.params.id);

        res.json({
            success: true,
            message: "Lead deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete lead:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete lead",
        });
    }
}