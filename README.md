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

## Deploy to Namecheap cPanel (proproof.worldwidechoices.com)

**Why the site looked broken:** cPanel was serving the repo’s root `index.html`, which loads `/src/main.jsx`. That only works with the Vite dev server. Production must serve the **built** files from `dist/` (bundled JS/CSS).

### One-time cPanel setup

1. **Subdomain** — confirm `proproof.worldwidechoices.com` exists (Domains → Subdomains). Note its **document root**, e.g. `/home/you/proproof.worldwidechoices.com`.

2. **Clone Git** — Git Version Control → Clone this repository to a path **outside** the docroot, e.g. `/home/you/repos/proproof` (not into the subdomain folder directly).

3. **Enable deployment** — open the repo → **Manage** → enable deployment:
   - **Deploy path** = subdomain document root from step 1
   - cPanel sets `$DEPLOYPATH` for `.cpanel.yml`

4. **Node.js (recommended)** — Software → **Setup Node.js App** → create app (Node 20+), document root can match the subdomain. In Git deploy shell, `npm` must be on `PATH` (cPanel often provides this after Node is installed).

5. **Deploy** — Pull/update from remote, then **Deploy HEAD Commit**. This runs `.cpanel.yml` → `npm ci` → `npm run build` → copies `dist/` into the subdomain folder.

6. **Visit** https://proproof.worldwidechoices.com/ — you should see bundled assets under `/assets/` (check DevTools → Network).

### If deploy fails (no npm on server)

On your PC:

```bash
npm ci
npm run build
```

Upload **everything inside `dist/`** to the subdomain document root via File Manager or FTP (not the whole repo).

### Production API

Shared cPanel hosting serves **static files only**. The Express API in `server/` does not run there, so **upload/checkout will not work** on the live subdomain unless you host the API elsewhere and set `VITE_API_BASE` at build time. The marketing pages (hero, pricing, etc.) will work.

### Troubleshooting

| Symptom | Fix |
|---------|-----|
| Blank page | Docroot must contain **built** `index.html` + `assets/`, not repo root |
| 404 on `/assets/...` | Redeploy `dist/`; confirm deploy path is subdomain root |
| Submit form errors | Expected without a hosted API; use `npm run dev` locally for full flow |
