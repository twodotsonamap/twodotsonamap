# Two Dots on a Map — The Mailbox

A tiny digital mailbox: visitors can drop a note (everything is freeform text) or open a random note someone else left.
Dropped notes are held for approval before they can be drawn, so nothing goes live unmoderated.

## Setup

This uses two Neon branches so local testing never touches prod data: `main` 

1. **Env vars.** Copy `.env.example` to `.env.local` and fill in:
   - `TWODOTS_DATABASE_URL` — the **`dev`** branch's connection string from
     step 3 (not `main`/production — this is what your local server reads).
   - `ADMIN_PASSWORD` — whatever you'll type to log into `/admin` locally.
   - `ADMIN_SESSION_SECRET` — a random string, e.g. `openssl rand -hex 32`.

2. **Run the dev server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Moderation

Visit `/admin`, log in with `ADMIN_PASSWORD`, and approve or reject anything
waiting in the queue. Only approved notes can be drawn via "Open a mail".
