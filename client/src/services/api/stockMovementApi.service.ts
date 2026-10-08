import { StockMovement } from '../../types/erp';

const API_BASE_URL = 'http://localhost:4000/api/stock-movements';

export async function fetchStockMovementsFromApi(): Promise<StockMovement[]> {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch stock movements');
    return await res.json();
  } catch (err) {
    console.error('API Fetch Stock Movements Error:', err);
    return [];
  }
}

export async function createStockMovementInApi(movement: Partial<StockMovement>): Promise<StockMovement | null> {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movement),
    });
    if (!res.ok) throw new Error('Failed to create stock movement');
    return await res.json();
  } catch (err) {
    console.error('API Create Stock Movement Error:', err);
    return null;
  }
}

export async function updateStockMovementInApi(id: string, updates: Partial<StockMovement>): Promise<StockMovement | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update stock movement');
    return await res.json();
  } catch (err) {
    console.error('API Update Stock Movement Error:', err);
    return null;
  }
}

export async function deleteStockMovementFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete stock movement');
    return true;
  } catch (err) {
    console.error('API Delete Stock Movement Error:', err);
    return false;
  }
}
