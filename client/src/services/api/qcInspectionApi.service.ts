import { QCInspection } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/qc-inspections`;

export async function fetchQCInspectionsFromApi(): Promise<QCInspection[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch QC inspections');
    return await res.json();
  } catch (err) {
    console.error('API Fetch QC Inspections Error:', err);
    return [];
  }
}

export async function createQCInspectionInApi(qc: Partial<QCInspection>): Promise<QCInspection | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(qc),
    });
    if (!res.ok) throw new Error('Failed to create QC inspection');
    return await res.json();
  } catch (err) {
    console.error('API Create QC Inspection Error:', err);
    return null;
  }
}

export async function updateQCInspectionInApi(id: string, updates: Partial<QCInspection>): Promise<QCInspection | null> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update QC inspection');
    return await res.json();
  } catch (err) {
    console.error('API Update QC Inspection Error:', err);
    return null;
  }
}

export async function deleteQCInspectionFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete QC inspection');
    return true;
  } catch (err) {
    console.error('API Delete QC Inspection Error:', err);
    return false;
  }
}
