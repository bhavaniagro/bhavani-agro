import { ErpDocument } from '../../types/erp';

const API_BASE_URL = 'http://localhost:4000/api/documents';

export async function fetchDocumentsFromApi(): Promise<ErpDocument[]> {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch documents');
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (err) {
    console.error('API Fetch Documents Error:', err);
    return [];
  }
}

export async function createDocumentInApi(document: Partial<ErpDocument>): Promise<ErpDocument | null> {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document),
    });
    if (!res.ok) throw new Error('Failed to create document');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Create Document Error:', err);
    return null;
  }
}

export async function updateDocumentInApi(id: string, updates: Partial<ErpDocument>): Promise<ErpDocument | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update document');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Update Document Error:', err);
    return null;
  }
}

export async function deleteDocumentFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return true;
  } catch (err) {
    console.error('API Delete Document Error:', err);
    return false;
  }
}
