import { SalesInvoice } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/sales-invoices`;

export async function fetchSalesInvoicesFromApi(): Promise<SalesInvoice[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch sales invoices');
    return await res.json();
  } catch (err) {
    console.error('API Fetch Sales Invoices Error:', err);
    return [];
  }
}

export async function createSalesInvoiceInApi(invoice: Partial<SalesInvoice>): Promise<SalesInvoice | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    if (!res.ok) throw new Error('Failed to create sales invoice');
    return await res.json();
  } catch (err) {
    console.error('API Create Sales Invoice Error:', err);
    return null;
  }
}

export async function updateSalesInvoiceInApi(id: string, updates: Partial<SalesInvoice>): Promise<SalesInvoice | null> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update sales invoice');
    return await res.json();
  } catch (err) {
    console.error('API Update Sales Invoice Error:', err);
    return null;
  }
}

export async function deleteSalesInvoiceFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete sales invoice');
    return true;
  } catch (err) {
    console.error('API Delete Sales Invoice Error:', err);
    return false;
  }
}
