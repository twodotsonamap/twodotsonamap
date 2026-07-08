"use server";

import { sql } from "@/lib/db";
import {
  dropMailSchema,
  HONEYPOT_FIELD,
  RENDERED_AT_FIELD,
  MIN_SUBMIT_MS,
} from "@/lib/validation";

export async function dropMail(prevState, formData) {
  // Honeypot: a real visitor never fills this (it's hidden off-screen). Bots
  // that blindly fill every field trip it. Report success anyway so the bot
  // gets no signal that it was caught.
  if (formData.get(HONEYPOT_FIELD)) {
    return { ok: true };
  }

  // Reject submissions that arrive faster than a human could plausibly read
  // the form and type a message.
  const renderedAt = Number(formData.get(RENDERED_AT_FIELD));
  if (!Number.isFinite(renderedAt) || Date.now() - renderedAt < MIN_SUBMIT_MS) {
    return { ok: false, error: "Please try again." };
  }

  const parsed = dropMailSchema.safeParse({
    name: formData.get("name") ?? "",
    location: formData.get("location") ?? "",
    body: formData.get("body") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Something didn't look right.",
    };
  }

  const { name, location, body } = parsed.data;

  // Parameterized via the sql tagged template — name/location/body are bound
  // values, never concatenated into the query string.
  await sql`
    insert into messages (name, location, body)
    values (${name}, ${location}, ${body})
  `;

  return { ok: true };
}

export async function openMail() {
  // Draws one random approved message and bumps its opened_count in a
  // single statement, so the pick and the increment can't race against a
  // concurrent open. The message stays in the pool (status is untouched) so
  // it can be drawn again by someone else later.
  const rows = await sql`
    update messages
    set opened_count = opened_count + 1
    where id = (
      select id from messages
      where status = 'approved'
      order by random()
      limit 1
    )
    returning name, location, body
  `;

  return rows[0] ?? null;
}
