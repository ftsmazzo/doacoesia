# doacoesIA

Plataforma para gerenciar o ciclo de doacoes da assistencia social com frontend e backend separados.

## Stack

- Frontend: Next.js + TypeScript + Tailwind
- Backend: NestJS + Prisma + PostgreSQL
- Infra: EasyPanel (2 servicos + banco Postgres)

## Estrutura

- `apps/frontend`: aplicacao web responsiva (mobile-first)
- `apps/backend`: API REST + migracoes automatizadas

## Desenvolvimento local

1. Copie os exemplos de ambiente:
   - `apps/frontend/.env.example` -> `apps/frontend/.env`
   - `apps/backend/.env.example` -> `apps/backend/.env`
2. Instale dependencias na raiz:
   - `npm install`
3. Rode os servicos:
   - frontend: `npm run dev:frontend`
   - backend: `npm run dev:backend`

## Deploy no EasyPanel

### Backend

- Build context: `apps/backend`
- Dockerfile: `apps/backend/Dockerfile`
- Variaveis obrigatorias:
  - `DATABASE_URL`
  - `PORT=3001`
  - `CORS_ORIGIN=https://seu-front.com`
- Startup: automatico via `docker-entrypoint.sh`
  - executa `prisma migrate deploy`
  - sobe API com `node dist/main.js`

### Frontend

- Build context: `apps/frontend`
- Dockerfile: `apps/frontend/Dockerfile`
- Variavel recomendada:
  - `NEXT_PUBLIC_API_URL=https://sua-api.com`

## Endpoint inicial

- Healthcheck backend: `GET /api/health`
