# ProProof

Premium proofreading landing site with document upload and checkout. The repo is set up for **fully local, self-contained development** — no Stripe, cloud storage, or external APIs required.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (22 recommended)
- npm 10+

## Quick start (full stack)

```bash
npm install
npm run dev
```

This starts:

| Service | URL |
|---------|-----|
| Web (Vite) | http://localhost:5173 |
| Local API | http://localhost:3001 |

Open http://localhost:5173, scroll to **Ready to Shine?**, upload a `.txt`/`.pdf`/`.doc`/`.docx`, and complete the mock checkout.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | API + web together (recommended) |
| `npm run dev:web` | Frontend only (needs API for submissions) |
| `npm run dev:api` | Mock API only |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve production build |
| `npm run test:smoke` | API health + order + payment smoke test |
| `npm run lint` | ESLint |

## Local API

Mock backend in `server/`:

- `GET /api/health` — readiness check
- `POST /api/orders` — multipart upload + order creation
- `POST /api/orders/:id/pay` — mock payment (always succeeds)
- `GET /api/orders/:id` — order status

Uploads are stored under `server/uploads/`. Order metadata is persisted in `server/data/orders.json` (both paths are gitignored).

Optional env vars (see `.env.example`):

```bash
API_PORT=3001
MOCK_PAYMENT_DELAY_MS=800
```

## Smoke test

With the API running (`npm run dev:api` in one terminal, or full `npm run dev`):

```bash
npm run test:smoke
```

## Project structure

```
├── server/           # Express mock API
├── src/
│   ├── api/          # fetch client
│   └── components/   # React UI
├── scripts/          # smoke-test.mjs
└── vite.config.js    # proxies /api → localhost:3001
```

## Notes

- Google Fonts load from the CDN in `index.html` (requires network for typography in dev).
- Card fields in checkout are UI-only; payment is handled by the local mock API.
