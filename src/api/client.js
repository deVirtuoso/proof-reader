const API_BASE = import.meta.env.VITE_API_BASE || '';

async function parseJsonResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/api/health`);
  return parseJsonResponse(response);
}

export async function createOrder({ name, email, notes, tier, wordCount, file }) {
  const body = new FormData();
  body.append('name', name);
  body.append('email', email);
  body.append('notes', notes || '');
  body.append('tier', tier);
  body.append('wordCount', String(wordCount));
  body.append('file', file);

  const response = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    body,
  });
  return parseJsonResponse(response);
}

export async function payOrder(orderId) {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mock: true }),
  });
  return parseJsonResponse(response);
}

export async function getOrder(orderId) {
  const response = await fetch(`${API_BASE}/api/orders/${orderId}`);
  return parseJsonResponse(response);
}
