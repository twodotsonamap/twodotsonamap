"use client";

import { useState } from "react";
import DropMail from "./DropMail";
import OpenMail from "./OpenMail";
import styles from "./page.module.css";

export default function Home() {
  const [mode, setMode] = useState("idle"); // "idle" | "drop" | "opened"
  const [panelKey, setPanelKey] = useState(0);

  function startDrop() {
    setPanelKey((key) => key + 1);
    setMode("drop");
  }

  function startOpen() {
    setPanelKey((key) => key + 1);
    setMode("opened");
  }

  function reset() {
    setMode("idle");
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <header className={styles.hero}>
            <p className={styles.subtitle}>We&rsquo;ll always be together in electric dreams</p>
            <h1 className={styles.title}>TWO DOTS ON A MAP</h1>
            <p className={styles.tagline}>
              Drop a note for a stranger to find, or open one someone left.
            </p>
          </header>

          {mode === "idle" && (
            <div className={styles.choices}>
              <button className={styles.choiceButton} onClick={startDrop}>
                Drop a mail
              </button>
              <button className={styles.choiceButton} onClick={startOpen}>
                Open a mail
              </button>
            </div>
          )}

          {mode === "drop" && <DropMail key={panelKey} onCancel={reset} />}
          {mode === "opened" && <OpenMail key={panelKey} onBack={reset} />}
        </div>

        <footer className={styles.footer}>
          <p>Notes are filtered -- harmful notes will be rejected.</p>
          <p className={styles.copyright}>&copy; twodotsonamap</p>
        </footer>
      </main>
    </div>
  );
}
