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