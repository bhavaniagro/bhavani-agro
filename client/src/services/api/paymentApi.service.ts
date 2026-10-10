import { PaymentTransaction } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/payments`;

export async function fetchPaymentsFromApi(): Promise<PaymentTransaction[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch payments');
    return await res.json();
  } catch (err) {
    console.error('API Fetch Payments Error:', err);
    return [];
  }
}

export async function createPaymentInApi(payment: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    });
    if (!res.ok) throw new Error('Failed to create payment');
    return await res.json();
  } catch (err) {
    console.error('API Create Payment Error:', err);
    return null;
  }
}

export async function updatePaymentInApi(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update payment');
    return await res.json();
  } catch (err) {
    console.error('API Update Payment Error:', err);
    return null;
  }
}

export async function deletePaymentFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete payment');
    return true;
  } catch (err) {
    console.error('API Delete Payment Error:', err);
    return false;
  }
}
