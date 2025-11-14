## Lam Phương Admin Dashboard

A Next.js (App Router) dashboard used to visualize operational data coming from **lam-phuong-api**.  
The UI is built with [shadcn/ui](https://ui.shadcn.com), Tailwind CSS, and Lucide icons.

### Features

- KPI cards for revenue, orders, partners, and pending workflows
- Recent orders table with status badges
- Pending approvals list with priority indicators
- API health widget that surfaces uptime, latency, and error-rate telemetry
- Responsive layout that works across desktop and tablets

### Getting Started

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Connect to lam-phuong-api

Set the API base URL so the dashboard can fetch real metrics:

```bash
export NEXT_PUBLIC_LP_API_URL="https://lam-phuong-api.example.com"
```

Without this variable the dashboard falls back to mocked sample data, so you can still iterate on the UI offline.

### Tech Stack

- Next.js 16 (App Router, React Server Components)
- Tailwind CSS 3.x
- shadcn/ui component library
- TypeScript with path alias `@/*`

### Project Structure

- `src/app` – App Router routes and layout
- `src/components` – UI primitives and dashboard widgets
- `src/lib` – helpers (API client, utility functions)
- `src/types` – shared TypeScript types

Feel free to extend the widgets or add new routes (e.g., products, partners) using the same shadcn/ui building blocks.
