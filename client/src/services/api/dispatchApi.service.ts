import { DispatchChallan } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/dispatches`;

export async function fetchDispatchesFromApi(): Promise<DispatchChallan[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch dispatches');
    return await res.json();
  } catch (err) {
    console.error('API Fetch Dispatches Error:', err);
    return [];
  }
}

export async function createDispatchInApi(dispatch: Partial<DispatchChallan>): Promise<DispatchChallan | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dispatch),
    });
    if (!res.ok) throw new Error('Failed to create dispatch');
    return await res.json();
  } catch (err) {
    console.error('API Create Dispatch Error:', err);
    return null;
  }
}

export async function updateDispatchInApi(id: string, updates: Partial<DispatchChallan>): Promise<DispatchChallan | null> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update dispatch');
    return await res.json();
  } catch (err) {
    console.error('API Update Dispatch Error:', err);
    return null;
  }
}

export async function deleteDispatchFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete dispatch');
    return true;
  } catch (err) {
    console.error('API Delete Dispatch Error:', err);
    return false;
  }
}
