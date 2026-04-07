# Ensto Staff Dashboard (Next.js)

## Setup

```bash
pnpm install
cp .env .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

The frontend API client reads `NEXT_PUBLIC_API_URL`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Frontend API Layer

- Axios instance: `src/lib/api/client.ts`
- API contract types: `src/lib/api/types.ts`
- Token helpers: `src/lib/auth/token.ts`
- Resource services: `src/lib/api/services/*.service.ts`
- Query keys: `src/lib/api/query-keys.ts`
- React Query hooks:
  - `src/hooks/api/use-vehicles-query.ts`
  - `src/hooks/api/use-create-driver-mutation.ts`

## Example Integration

- GET vehicles query example:
  - `src/components/dashboard/vehicules/vehicules-table.tsx`
- POST create driver mutation example (with Zod validation in hook):
  - `src/components/dashboard/livreurs/create-driver-form.tsx`

This project uses the backend contract from `docs/api.md` and expects the backend envelope:

```json
{
  "success": true,
  "message": "optional",
  "data": {}
}
```
