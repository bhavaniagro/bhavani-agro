import { CompanyProfile } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/company`;

export async function fetchCompanyProfileFromApi(): Promise<CompanyProfile | null> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch company profile');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Fetch Company Profile Error:', err);
    return null;
  }
}

export async function updateCompanyProfileInApi(updates: Partial<CompanyProfile>): Promise<CompanyProfile | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update company profile');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Update Company Profile Error:', err);
    return null;
  }
}
