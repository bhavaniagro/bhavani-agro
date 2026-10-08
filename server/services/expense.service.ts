import * as expenseRepo from "../repositories/expense.repository";

export async function fetchExpenses() {
    return await expenseRepo.getAllExpenses();
}

export async function addExpense(data: Record<string, unknown>) {
    return await expenseRepo.createExpense(data);
}

export async function editExpense(id: string, data: Record<string, unknown>) {
    return await expenseRepo.updateExpense(id, data);
}

export async function removeExpense(id: string) {
    return await expenseRepo.deleteExpense(id);
}
