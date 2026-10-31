# CivicPulse: Public Grievance Tracker

**HACK-P423 | Backend Web Development Hackathon**
Node.js · Express · SQLite · JWT

Citizens file complaints and usually never hear back. CivicPulse gives every grievance a **tracking ID** (for example `GRV-0001`), moves it through a clear pipeline, shows **who did what and why**, and gives officers one dashboard for pending and recurring issues.

```
Submitted  >  Under Review  >  In Progress  >  Resolved
```

![Public tracking](docs/shot_track.png)
![Officer dashboard](docs/shot_admin.png)

## Features

- **Register / login** with bcrypt-hashed passwords and JWT sessions (8 hour expiry)
- **Three roles:** citizen, officer, admin (enforced by middleware on the server, not just hidden in the UI)
- **Full CRUD** on grievances with request validation and clear error messages
- **Filters, search and pagination** through query parameters
- **Public tracking by ID** (no login) showing status and officer remarks, with no personal data exposed
- **Status history** with officer remarks and a timeline
- **Officer dashboard:** totals, resolution rate, breakdown by status and category, and recurring unresolved issues (same place and category reported two or more times)
- **29 automated API tests**, all passing

## Tech stack

| Layer | Choice |
|---|---|
| Server | Node.js + Express 5 (routing, middleware) |
| Database | SQLite via Node's built-in `node:sqlite` (joins, indexes, foreign keys, transactions) |
| Security | JWT (`jsonwebtoken`), `bcryptjs`, role checks, input validation |
| Frontend | Plain HTML, CSS and JavaScript (no build step) |
| Tests | Node's built-in test runner, in-memory SQLite |
| Deployment | Render (`render.yaml` included) |

## Quick start

Requires **Node.js 22.13 or newer** (check with `node -v`). SQLite comes from Node's built-in `node:sqlite` module, so there is nothing native to compile.

```bash
git clone https://github.com/<your-username>/civicpulse.git
cd civicpulse
npm install
npm start
```

Open **http://localhost:3000**. On first start the database is empty, so demo data is created automatically.

| Role | Email | Password |
|---|---|---|
| Citizen | `citizen@civicpulse.local` | `Citizen@123` |
| Officer | `officer@civicpulse.local` | `Officer@123` |
| Admin | `admin@civicpulse.local` | `Admin@123` |

Demo tracking IDs to try without logging in: `GRV-0001` to `GRV-0006`.

Other commands:

```bash
npm test        # run the 29 API tests
npm run dev     # restart automatically on file changes
npm run seed    # add demo data if the database is empty
```

### Configuration (environment variables)

Copy `.env.example` and set values in your host. Variables are read from the environment (no dotenv dependency).

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `JWT_SECRET` | Secret used to sign tokens. **Required when `NODE_ENV=production`.** | dev-only value |
| `DB_PATH` | SQLite file location | `civicpulse.db` |
| `SEED_DEMO` | Set to `off` to skip demo data on an empty database | on |
| `LOG_REQUESTS` | Set to `off` to silence the request logger | on |

## Architecture

```
Browser (HTML / JS)
      |
Express  ->  Middleware: Logger -> JWT auth -> Role check
      |
Route handlers: validation + business rules
      |
SQLite: users | grievances | history
```

**Tables:** `users` (role constrained to citizen/officer/admin), `grievances` (status constrained to the four stages, foreign key to `users`), `history` (foreign key to `grievances` with `ON DELETE CASCADE`). Indexes exist on `user_id`, `status`, `category` and `grievance_id`.

## REST API

Base path: `/api`. Send `Authorization: Bearer <token>` on protected routes.

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public (always creates a citizen) |
| POST | `/api/auth/login` | Public |
| GET | `/api/track/:trackingId` | Public |
| GET | `/api/grievances?status=&category=&q=&page=&limit=` | Logged in (citizens see only their own) |
| POST | `/api/grievances` | Logged in |
| GET | `/api/grievances/:id` | Owner / officer / admin |
| PUT | `/api/grievances/:id` | Owner (details, while Submitted) / officer (status, remarks) |
| DELETE | `/api/grievances/:id` | Admin |
| GET | `/api/grievances/stats/summary` | Officer / admin |
| GET | `/api/health` | Public |

### Example requests

```bash
# Log in and keep the token
TOKEN=$(curl -s -X POST localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"citizen@civicpulse.local","password":"Citizen@123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

# File a grievance
curl -X POST localhost:3000/api/grievances \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Broken swing in park","description":"The swing chain is broken.","category":"Public Safety","location":"Central Park"}'

# Track it publicly (no token)
curl localhost:3000/api/track/GRV-0007
```

### Business rules

- Valid categories: `Roads`, `Water Supply`, `Electricity`, `Sanitation`, `Public Safety`, `Other`.
- Status only moves **forward** (an attempt to go backwards returns `409`). Resolving requires a remark (`400` otherwise).
- A citizen can edit their own grievance only while it is still `Submitted`; after that it is locked (`409`).
- Citizens cannot change status or add remarks (`403`). Only admins can delete.
- Errors use proper codes: `400` validation, `401` not authenticated, `403` not allowed, `404` not found, `409` conflict.

## Project structure

```
server.js              entry point (opens DB, seeds if empty, starts Express)
src/
  app.js               builds the Express app (also used by tests)
  db.js                schema, indexes, foreign keys
  middleware.js        logger, JWT authenticate, requireRole, error handlers
  validate.js          request validation
  service.js           shared database helpers
  seed.js              demo users and grievances
  routes/              auth.js, track.js, grievances.js
public/                index.html, app.js, style.css (frontend)
tests/api.test.js      29 API tests
docs/                  screenshots
render.yaml            Render deployment blueprint
```

## Deploy on Render

1. Push this repo to GitHub (see `GITHUB_STEPS.md`).
2. On Render choose **New > Blueprint** (or **Web Service**) and select the repo.
3. Build command `npm install`, start command `npm start`, and set `JWT_SECRET` (the blueprint generates one).

> **Note:** on Render's free plan the disk is not persistent, so the SQLite file resets when the service restarts or redeploys. The demo data is recreated automatically on the next start. For permanent storage, attach a Render persistent disk and set `DB_PATH` to a path on it.

## Security notes

- Passwords are hashed with bcrypt; password hashes are never returned by the API.
- Registration cannot create officers or admins; the role is always `citizen`.
- All SQL uses parameterised statements. The frontend inserts server data as text, never as HTML.
- Login errors do not reveal whether the email or the password was wrong.
- The demo passwords above are for local demos only. Change or remove the seed users in a real deployment.

## Future scope

SMS or email notifications on status change, photo upload as evidence, department-wise routing, SLA deadlines with auto-escalation, multilingual support.

## Team

Team: `<team name>` | Members: `<names>`
