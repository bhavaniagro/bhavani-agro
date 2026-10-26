import { MachineStatusHistory } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/machine-history`;

export async function fetchMachineHistoryFromApi(): Promise<MachineStatusHistory[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch machine history');
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (err) {
    console.error('API Fetch Machine History Error:', err);
    return [];
  }
}

export async function createMachineHistoryInApi(
  history: Omit<MachineStatusHistory, 'id'>
): Promise<MachineStatusHistory | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(history),
    });
    if (!res.ok) throw new Error('Failed to create machine history');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Create Machine History Error:', err);
    return null;
  }
}

export async function deleteMachineHistoryFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete machine history');
    return true;
  } catch (err) {
    console.error('API Delete Machine History Error:', err);
    return false;
  }
}
