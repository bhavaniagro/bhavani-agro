import { ProductionOrder } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/production-orders`;

export async function fetchProductionOrdersFromApi(): Promise<ProductionOrder[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch production orders');
    return await res.json();
  } catch (err) {
    console.error('API Fetch Production Orders Error:', err);
    return [];
  }
}

export async function createProductionOrderInApi(order: Partial<ProductionOrder>): Promise<ProductionOrder | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to create production order');
    return await res.json();
  } catch (err) {
    console.error('API Create Production Order Error:', err);
    return null;
  }
}

export async function updateProductionOrderInApi(id: string, updates: Partial<ProductionOrder>): Promise<ProductionOrder | null> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update production order');
    return await res.json();
  } catch (err) {
    console.error('API Update Production Order Error:', err);
    return null;
  }
}

export async function deleteProductionOrderFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete production order');
    return true;
  } catch (err) {
    console.error('API Delete Production Order Error:', err);
    return false;
  }
}
