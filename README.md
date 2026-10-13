# OliveIoT Backend (Express + MongoDB + JWT)

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and fill `MONGO_URI` and `JWT_SECRET`
3. `npm run seed`   (loads demo data + 4 role accounts)
4. `npm run dev`    (http://localhost:5000)

## Endpoints
| Method | Route | Roles |
|---|---|---|
| POST | /api/auth/login | public |
| GET | /api/summary | any logged-in |
| GET | /api/sites | any |
| POST/DELETE | /api/sites(/:id) | superadmin |
| PUT | /api/sites/:id | superadmin, siteadmin (own site) |
| GET | /api/meters?site=&status=&q= | any |
| GET | /api/meters/:meterId/live | any |
| POST | /api/meters | superadmin, siteadmin (own site) |
| GET | /api/alerts?status=active\|acknowledged | any |
| PATCH | /api/alerts/:id/ack | superadmin, siteadmin, operator |
| GET | /api/reports?site=&meter=&from=&to= | any |

Send the token as `Authorization: Bearer <token>`.
