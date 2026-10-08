import type { Request, Response } from "express";
import {
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
} from "../services/product.service";

export async function getProducts(_req: Request, res: Response): Promise<void> {
    try {
        const products = await fetchProducts();
        res.json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
    try {
        const product = await addProduct(req.body);
        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error("Failed to create product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
    try {
        const product = await editProduct(req.params.id, req.body);
        res.json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error("Failed to update product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update product",
        });
    }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
    try {
        await removeProduct(req.params.id);
        res.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
        });
    }
}
