const API_BASE = process.env.API_BASE || 'http://localhost:3001';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log(`Smoke test against ${API_BASE}`);

  const health = await request('/api/health');
  assert(health.ok && health.data.ok, `Health check failed: ${health.status}`);
  console.log('✓ GET /api/health');

  const form = new FormData();
  form.append('name', 'Smoke Test User');
  form.append('email', 'smoke@local.test');
  form.append('notes', 'Automated smoke test');
  form.append('tier', 'normal');
  form.append('wordCount', '1000');
  form.append('file', new Blob(['Hello proofread smoke test.'], { type: 'text/plain' }), 'smoke.txt');

  const create = await request('/api/orders', { method: 'POST', body: form });
  assert(create.ok && create.data.order?.id, `Create order failed: ${create.status} ${JSON.stringify(create.data)}`);
  const orderId = create.data.order.id;
  console.log(`✓ POST /api/orders → ${orderId}`);

  const pay = await request(`/api/orders/${orderId}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mock: true }),
  });
  assert(pay.ok, `Pay order failed: ${pay.status}`);
  console.log('✓ POST /api/orders/:id/pay');

  await new Promise((r) => setTimeout(r, 1200));

  const fetched = await request(`/api/orders/${orderId}`);
  assert(fetched.ok && fetched.data.order?.status === 'paid', `Order not paid: ${JSON.stringify(fetched.data)}`);
  console.log('✓ GET /api/orders/:id (paid)');

  console.log('\nAll smoke tests passed.');
}

main().catch((err) => {
  console.error('\nSmoke test failed:', err.message);
  process.exit(1);
});
