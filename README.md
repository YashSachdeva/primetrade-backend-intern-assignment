# Primetrade Backend Intern Assignment

Production-minded REST API with authentication, role-based access control, product CRUD, Swagger documentation, a Postgres schema, and a React UI for testing the API.

## Tech Stack

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Auth: bcrypt password hashing, JWT access tokens, role-based authorization
- Validation: Zod schemas and centralized error handling
- Docs: Swagger UI at `/api/docs`
- Frontend: React + Vite + TypeScript
- Optional deployment: Docker Compose for Postgres and Redis

## Quick Start

```bash
npm install
cp backend/.env.example backend/.env
npm run docker:up
npm run dev --workspace backend
```

In another terminal:

```bash
npm run dev --workspace frontend
```

Open:

- API: `http://localhost:4000/api/v1/health`
- Swagger: `http://localhost:4000/api/docs`
- Frontend: `http://localhost:5173`

## Database Setup

After Postgres is running:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run seed --workspace backend
```

Seeded admin account:

- Email: `admin@primetrade.ai`
- Password: `Admin@12345`

## API Overview

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Products

- `GET /api/v1/products` - authenticated users
- `GET /api/v1/products/:id` - authenticated users
- `POST /api/v1/products` - admin only
- `PATCH /api/v1/products/:id` - admin only
- `DELETE /api/v1/products/:id` - admin only

## Security Highlights

- Passwords are hashed with bcrypt before persistence.
- JWTs include only stable identity claims: user id, email, and role.
- All write inputs are validated with Zod.
- Helmet and CORS are configured centrally.
- Protected routes require `Authorization: Bearer <token>`.
- Role checks are implemented as reusable middleware.

## Scalability Note

The project is split into modules by domain (`auth`, `products`, shared middleware, config, database). New modules can be added without changing existing routes. In production, this can scale by:

- Moving Postgres behind managed read replicas for read-heavy product traffic.
- Adding Redis for token/session deny-listing, cache-aside product reads, and rate-limit counters.
- Running stateless API containers behind a load balancer.
- Separating domains into services later, such as Auth Service and Catalog Service, once traffic and team ownership justify it.
- Shipping logs to a centralized system and adding request tracing for observability.

## Submission Checklist

- REST API with versioned routes
- JWT auth and role-based access
- Product CRUD entity
- Postgres Prisma schema
- Swagger API docs
- Postman collection at `docs/postman_collection.json`
- React UI connected to the API
- Docker Compose and README setup
