"use client";

import { useEffect, useState, useTransition } from "react";
import { openMail } from "./actions";
import styles from "./page.module.css";

export default function OpenMail({ onBack }) {
  const [drawnMail, setDrawnMail] = useState(undefined); // undefined = loading, null = pool empty
  const [opening, startOpening] = useTransition();

  function draw() {
    startOpening(async () => {
      const message = await openMail();
      setDrawnMail(message);
    });
  }

  // Draw one as soon as this panel appears. The parent unmounts/remounts
  // this component each time "Open a mail" is clicked from idle, so this
  // effect firing again on a fresh mount is exactly what we want.
  useEffect(() => {
    draw();
  }, []);

  return (
    <div className={styles.noteCard}>
      {drawnMail === undefined ? (
        <p>Opening…</p>
      ) : drawnMail ? (
        <>
          <p className={styles.noteBody}>{drawnMail.body}</p>
          <p className={styles.noteMeta}>
            {drawnMail.name || "Anonymous"}
            {drawnMail.location ? ` — ${drawnMail.location}` : ""}
          </p>
        </>
      ) : (
        <p>The mailbox is empty right now. Be the first to drop one in.</p>
      )}

      <div className={styles.formActions}>
        <button className={styles.linkButton} onClick={onBack}>
          Back
        </button>
        <button className={styles.submitButton} onClick={draw} disabled={opening}>
          {opening ? "Opening…" : "Draw another"}
        </button>
      </div>
    </div>
  );
}
