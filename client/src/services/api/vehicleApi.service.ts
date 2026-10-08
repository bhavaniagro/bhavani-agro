import { VehicleMaster } from '../../types/erp';

const API_BASE_URL = 'http://localhost:4000/api/vehicles';

export async function fetchVehiclesFromApi(): Promise<VehicleMaster[]> {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return await res.json();
  } catch (err) {
    console.error('API Fetch Vehicles Error:', err);
    return [];
  }
}

export async function createVehicleInApi(vehicle: Partial<VehicleMaster>): Promise<VehicleMaster | null> {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!res.ok) throw new Error('Failed to create vehicle');
    return await res.json();
  } catch (err) {
    console.error('API Create Vehicle Error:', err);
    return null;
  }
}

export async function updateVehicleInApi(id: string, updates: Partial<VehicleMaster>): Promise<VehicleMaster | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update vehicle');
    return await res.json();
  } catch (err) {
    console.error('API Update Vehicle Error:', err);
    return null;
  }
}

export async function deleteVehicleFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete vehicle');
    return true;
  } catch (err) {
    console.error('API Delete Vehicle Error:', err);
    return false;
  }
}
