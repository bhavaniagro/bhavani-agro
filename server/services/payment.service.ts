import * as paymentRepo from "../repositories/payment.repository";

export async function fetchAllPayments() {
    return await paymentRepo.getAllPayments();
}

export async function addPayment(data: Record<string, unknown>) {
    return await paymentRepo.createPayment(data);
}

export async function editPayment(id: string, data: Record<string, unknown>) {
    return await paymentRepo.updatePayment(id, data);
}

export async function removePayment(id: string) {
    return await paymentRepo.deletePayment(id);
}
