import { ProductionBatch } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/production-batches`;

export async function fetchProductionBatchesFromApi(): Promise<ProductionBatch[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch production batches');
    return await res.json();
  } catch (err) {
    console.error('API Fetch Production Batches Error:', err);
    return [];
  }
}

export async function createProductionBatchInApi(batch: Partial<ProductionBatch>): Promise<ProductionBatch | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    if (!res.ok) throw new Error('Failed to create production batch');
    return await res.json();
  } catch (err) {
    console.error('API Create Production Batch Error:', err);
    return null;
  }
}

export async function updateProductionBatchInApi(id: string, updates: Partial<ProductionBatch>): Promise<ProductionBatch | null> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update production batch');
    return await res.json();
  } catch (err) {
    console.error('API Update Production Batch Error:', err);
    return null;
  }
}

export async function deleteProductionBatchFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete production batch');
    return true;
  } catch (err) {
    console.error('API Delete Production Batch Error:', err);
    return false;
  }
}
