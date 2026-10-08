import * as salesInvoiceRepo from "../repositories/salesInvoice.repository";

export async function fetchAllSalesInvoices() {
    return await salesInvoiceRepo.getAllSalesInvoices();
}

export async function addSalesInvoice(data: Record<string, unknown>) {
    return await salesInvoiceRepo.createSalesInvoice(data);
}

export async function editSalesInvoice(id: string, data: Record<string, unknown>) {
    return await salesInvoiceRepo.updateSalesInvoice(id, data);
}

export async function removeSalesInvoice(id: string) {
    return await salesInvoiceRepo.deleteSalesInvoice(id);
}
