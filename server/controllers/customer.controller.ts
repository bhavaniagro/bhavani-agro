import type { Request, Response } from "express";
import {
    addCustomer,
    fetchCustomers,
    editCustomer,
    removeCustomer,
} from "../services/customer.service";

export async function getCustomers(
    _req: Request,
    res: Response
) {
    try {
        const customers = await fetchCustomers();

        res.json({
            success: true,
            data: customers,
        });
    } catch (error) {
        console.error("Failed to fetch customers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customers",
        });
    }
}

export async function createCustomer(
    req: Request,
    res: Response
) {
    try {
        const customer = await addCustomer(req.body);

        res.status(201).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        console.error("Failed to create customer:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create customer",
        });
    }
}
export async function updateCustomer(
    req: Request,
    res: Response
) {
    try {
        const customer = await editCustomer(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            data: customer,
        });
    } catch (error) {
        console.error("Failed to update customer:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update customer",
        });
    }
}
export async function deleteCustomer(
    req: Request,
    res: Response
) {
    try {
        await removeCustomer(req.params.id);

        res.json({
            success: true,
            message: "Customer deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete customer:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete customer",
        });
    }
}