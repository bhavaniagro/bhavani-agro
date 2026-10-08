import { CompanyProfile } from '../../types/erp';

const API_BASE_URL = 'http://localhost:4000/api/company';

export async function fetchCompanyProfileFromApi(): Promise<CompanyProfile | null> {
  try {
    const res = await fetch(API_BASE_URL);
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
    const res = await fetch(API_BASE_URL, {
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
