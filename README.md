# Shalam Properties — API

The backend REST API for Shalam Properties, a luxury real estate platform. Built with [NestJS](https://nestjs.com), [Prisma](https://www.prisma.io), and PostgreSQL.

## Overview

This API powers the Shalam Properties frontend and admin dashboard. It manages property listings across three categories — **land**, **houses**, and **cars** — along with customer inquiries and admin authentication.

## Tech Stack

- **NestJS** — Node.js framework
- **Prisma** — ORM and database migrations
- **PostgreSQL** — Database
- **JWT** — Admin authentication
- **bcrypt** — Password hashing
- **Docker** — Local database setup

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for running PostgreSQL locally)

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/shalam
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 4. Run migrations and seed

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the server

```bash
# development
npm run start:dev

# production
npm run start:prod
```

The API will be available at `http://localhost:3000/api`.

## API Endpoints

All routes are prefixed with `/api`.

### Auth

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/auth/login` | Public | Admin login — returns a JWT |
| `POST` | `/auth/change-password` | Admin | Change admin password |

### Listings

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `GET` | `/listings` | Public | Get all listings. Filter by `?category=land\|house\|car` and `?featured=true` |
| `GET` | `/listings/:id` | Public | Get a single listing |
| `POST` | `/listings` | Admin | Create a listing |
| `PATCH` | `/listings/:id` | Admin | Update a listing |
| `DELETE` | `/listings/:id` | Admin | Delete a listing |

### Inquiries

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/inquiries` | Public | Submit a contact/inquiry form |
| `GET` | `/inquiries` | Admin | Get all inquiries |
| `PATCH` | `/inquiries/:id/read` | Admin | Mark an inquiry as read |
| `DELETE` | `/inquiries/:id` | Admin | Delete an inquiry |

### Authentication

Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Data Models

### Listing

Supports three categories with category-specific fields:

- **Land** — title, price, location, size
- **House** — title, price, location, bedrooms, bathrooms, house size
- **Car** — title, price, brand, model, year, mileage

All listings support multiple images, a description, and a `featured` flag.

### Inquiry

Submitted by site visitors. Contains name, email, optional phone, message, and an optional reference to a listing.

## Project Structure

```
src/
├── auth/           # JWT auth, login, password management
├── listings/       # Listing CRUD
├── inquiries/      # Inquiry CRUD
├── mail/           # Mail service
├── prisma/         # Prisma client service
└── main.ts         # App entry point
```

## Scripts

```bash
npm run start:dev     # Start in watch mode
npm run build         # Compile TypeScript
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run lint          # Lint
```
