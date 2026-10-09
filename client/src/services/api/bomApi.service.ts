import { BOM } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/boms`;

export async function fetchBOMsFromApi(): Promise<BOM[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch BOMs');
    return await res.json();
  } catch (err) {
    console.error('API Fetch BOMs Error:', err);
    return [];
  }
}

export async function createBOMInApi(bom: Partial<BOM>): Promise<BOM | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bom),
    });
    if (!res.ok) throw new Error('Failed to create BOM');
    return await res.json();
  } catch (err) {
    console.error('API Create BOM Error:', err);
    return null;
  }
}

export async function updateBOMInApi(id: string, updates: Partial<BOM>): Promise<BOM | null> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update BOM');
    return await res.json();
  } catch (err) {
    console.error('API Update BOM Error:', err);
    return null;
  }
}

export async function deleteBOMFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete BOM');
    return true;
  } catch (err) {
    console.error('API Delete BOM Error:', err);
    return false;
  }
}
