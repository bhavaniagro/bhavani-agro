import { ExpenseRecord } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/expenses`;

export async function fetchExpensesFromApi(): Promise<ExpenseRecord[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch expenses');
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (err) {
    console.error('API Fetch Expenses Error:', err);
    return [];
  }
}

export async function createExpenseInApi(expense: Partial<ExpenseRecord>): Promise<ExpenseRecord | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    if (!res.ok) throw new Error('Failed to create expense');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Create Expense Error:', err);
    return null;
  }
}

export async function updateExpenseInApi(id: string, updates: Partial<ExpenseRecord>): Promise<ExpenseRecord | null> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update expense');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Update Expense Error:', err);
    return null;
  }
}

export async function deleteExpenseFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete expense');
    return true;
  } catch (err) {
    console.error('API Delete Expense Error:', err);
    return false;
  }
}
