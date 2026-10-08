import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../repositories/product.repository";

export async function fetchProducts() {
    return getAllProducts();
}

export async function addProduct(data: Record<string, unknown>) {
    return createProduct(data);
}

export async function editProduct(id: string, data: Record<string, unknown>) {
    return updateProduct(id, data);
}

export async function removeProduct(id: string): Promise<void> {
    return deleteProduct(id);
}
