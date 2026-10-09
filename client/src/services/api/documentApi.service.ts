import { ErpDocument } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/documents`;

export async function fetchDocumentsFromApi(): Promise<ErpDocument[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
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
    const res = await fetch(ENDPOINT_URL, {
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
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
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
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return true;
  } catch (err) {
    console.error('API Delete Document Error:', err);
    return false;
  }
}

export async function uploadDocumentFileInApi(file: File): Promise<{ fileUrl: string; fileName: string; fileSize: string } | null> {
  try {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });

    const res = await fetch(`${ENDPOINT_URL}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileData: base64
      }),
    });

    if (!res.ok) throw new Error('Failed to upload document file');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Upload Document File Error:', err);
    return null;
  }
}
