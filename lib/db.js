import "server-only";
import { neon } from "@neondatabase/serverless";

// Named to match what Vercel's Neon integration auto-populates for this
// project (Settings -> Environment Variables), so Production needs no
// manual DB env var setup — only .env.local needs to be set by hand.
if (!process.env.TWODOTS_DATABASE_URL) {
  throw new Error("TWODOTS_DATABASE_URL is not set. See .env.example.");
}

// `sql` is a tagged-template query function: every ${...} interpolation is
// sent to Postgres as a bound parameter, never string-concatenated into the
// query. Always query through this — never build SQL with string
// concatenation/interpolation, or it becomes injectable.
export const sql = neon(process.env.TWODOTS_DATABASE_URL);
