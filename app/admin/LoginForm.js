"use client";

import { useActionState } from "react";
import { login } from "./actions";
import styles from "./admin.module.css";

const initialState = { ok: false, error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className={styles.loginCard}>
      <h1>Admin</h1>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        autoFocus
      />
      {state?.error ? <p className={styles.error}>{state.error}</p> : null}
      <button type="submit" disabled={pending}>
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
