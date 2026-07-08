"use client";

import { useActionState, useState } from "react";
import { dropMail } from "./actions";
import { HONEYPOT_FIELD, RENDERED_AT_FIELD } from "@/lib/validation";
import styles from "./page.module.css";

const initialDropState = { ok: false, error: null };

export default function DropMail({ onCancel }) {
  const [dropState, dropAction, dropPending] = useActionState(
    dropMail,
    initialDropState
  );
  // Captured once, on mount — i.e. exactly when this panel appears, since
  // the parent remounts it (via a changing `key`) every time it's reopened.
  const [renderedAt] = useState(() => Date.now());

  if (dropState.ok) {
    return (
      <div className={styles.noteCard}>
        <p>Your note is in the mailbox.</p>
        <p className={styles.noteMeta}>
          It&rsquo;ll show up for others once it&rsquo;s been reviewed.
        </p>
        <button className={styles.linkButton} onClick={onCancel}>
          Back
        </button>
      </div>
    );
  }

  return (
    <form action={dropAction} className={styles.dropCard}>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required minLength={3} maxLength={80} autoComplete="off" />
      </div>

      <div className={styles.field}>
        <label htmlFor="location">Location</label>
        <input id="location" name="location" required minLength={3} maxLength={100} autoComplete="off" />
      </div>

      <div className={styles.field}>
        <label htmlFor="body">Your note</label>
        <textarea id="body" name="body" required minLength={3} maxLength={1000} rows={5} />
      </div>

      {/* Honeypot: hidden from real visitors, catches bots that fill every field. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Website</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name={RENDERED_AT_FIELD} value={renderedAt} />

      {dropState.error && <p className={styles.error}>{dropState.error}</p>}

      <div className={styles.formActions}>
        <button type="button" className={styles.linkButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton} disabled={dropPending}>
          {dropPending ? "Sending…" : "Send it off"}
        </button>
      </div>
    </form>
  );
}
