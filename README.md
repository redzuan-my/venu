# VENU — Build 1

Real application shell for the PP/IP/EU internal event ecosystem.

## Run locally
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## Deploy
Upload/push these files to the GitHub `venu` repository, then import the repository into Vercel.

## URL architecture
- Internal app: `/dashboard`, `/events`, `/speakers`, `/templates`, `/users`
- Event workspace: `/events/[id]/workspace`
- Public event: `/e/[slug]`

`NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_EVENT_URL` are reserved in `.env.example` so the internal app and public event experience can later be mapped to separate domains/subdomains without restructuring the app.

## Build 1 scope
This is the permanent Next.js codebase shell, not the earlier HTML prototype. It uses mock data for now. Database, authentication, permissions and persistence are intentionally the next functional layer.
