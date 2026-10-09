import { Employee } from '../../types/erp';
import { API_BASE_URL } from '../../config/apiConfig';

const ENDPOINT_URL = `${API_BASE_URL}/employees`;

export async function fetchEmployeesFromApi(): Promise<Employee[]> {
  try {
    const res = await fetch(ENDPOINT_URL);
    if (!res.ok) throw new Error('Failed to fetch employees');
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (err) {
    console.error('API Fetch Employees Error:', err);
    return [];
  }
}

export async function createEmployeeInApi(employee: Partial<Employee>): Promise<Employee | null> {
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error('Failed to create employee');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Create Employee Error:', err);
    return null;
  }
}

export async function updateEmployeeInApi(id: string, updates: Partial<Employee>): Promise<Employee | null> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update employee');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.error('API Update Employee Error:', err);
    return null;
  }
}

export async function deleteEmployeeFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${ENDPOINT_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete employee');
    return true;
  } catch (err) {
    console.error('API Delete Employee Error:', err);
    return false;
  }
}
