import { ProductionBatch } from '../../types/erp';

const API_BASE_URL = 'http://localhost:4000/api/production-batches';

export async function fetchProductionBatchesFromApi(): Promise<ProductionBatch[]> {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch production batches');
    return await res.json();
  } catch (err) {
    console.error('API Fetch Production Batches Error:', err);
    return [];
  }
}

export async function createProductionBatchInApi(batch: Partial<ProductionBatch>): Promise<ProductionBatch | null> {
  try {
    const res = await fetch(API_BASE_URL, {
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
    const res = await fetch(`${API_BASE_URL}/${id}`, {
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
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete production batch');
    return true;
  } catch (err) {
    console.error('API Delete Production Batch Error:', err);
    return false;
  }
}
