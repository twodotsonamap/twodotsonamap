import { sql } from "@/lib/db";
import { hasValidAdminSession } from "@/lib/session";
import LoginForm from "./LoginForm";
import { approveMail, rejectMail, logout } from "./actions";
import styles from "./admin.module.css";

export const metadata = {
  title: "Admin | Two Dots on a Map",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await hasValidAdminSession())) {
    return (
      <main className={styles.page}>
        <LoginForm />
      </main>
    );
  }

  const pending = await sql`
    select id, name, location, body, created_at
    from messages
    where status = 'pending'
    order by created_at asc
  `;

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1>Pending mail ({pending.length})</h1>
        <form action={logout}>
          <button type="submit" className={styles.logoutButton}>
            Log out
          </button>
        </form>
      </div>

      {pending.length === 0 ? (
        <p className={styles.empty}>Nothing waiting on review.</p>
      ) : (
        <ul className={styles.list}>
          {pending.map((message) => (
            <li key={message.id} className={styles.item}>
              <p className={styles.itemBody}>{message.body}</p>
              <p className={styles.itemMeta}>
                {message.name || "Anonymous"}
                {message.location ? ` — ${message.location}` : ""}
              </p>
              <div className={styles.itemActions}>
                <form action={approveMail.bind(null, message.id)}>
                  <button type="submit" className={styles.approveButton}>
                    Approve
                  </button>
                </form>
                <form action={rejectMail.bind(null, message.id)}>
                  <button type="submit" className={styles.rejectButton}>
                    Reject
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
