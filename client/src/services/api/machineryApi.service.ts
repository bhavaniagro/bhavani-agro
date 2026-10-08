import { Machinery } from '../../types/erp';

const API_BASE_URL = 'http://localhost:4000/api/machinery';

export async function fetchMachineryFromApi(): Promise<Machinery[]> {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch machinery');
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (err) {
    console.error('API Fetch Machinery Error:', err);
    return [];
  }
}

export async function createMachineryInApi(machinery: Partial<Machinery>): Promise<Machinery | null> {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(machinery),
    });
    if (!res.ok) throw new Error('Failed to create machinery');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Create Machinery Error:', err);
    return null;
  }
}

export async function updateMachineryInApi(id: string, updates: Partial<Machinery>): Promise<Machinery | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update machinery');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Update Machinery Error:', err);
    return null;
  }
}

export async function deleteMachineryFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete machinery');
    return true;
  } catch (err) {
    console.error('API Delete Machinery Error:', err);
    return false;
  }
}
