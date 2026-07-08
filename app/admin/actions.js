"use server";

import { sql } from "@/lib/db";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdminSession,
  verifyAdminPassword,
} from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(prevState, formData) {
  const password = formData.get("password");

  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    return { ok: false, error: "Wrong password." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  await destroyAdminSession();
  revalidatePath("/admin");
}

export async function approveMail(id) {
  // Re-check auth here even though the admin page already checked before
  // rendering the button: Server Actions are callable HTTP endpoints on
  // their own, so every mutating action must verify independently.
  await requireAdminSession();

  const messageId = Number(id);
  if (!Number.isInteger(messageId)) return;

  await sql`update messages set status = 'approved' where id = ${messageId}`;
  revalidatePath("/admin");
}

export async function rejectMail(id) {
  await requireAdminSession();

  const messageId = Number(id);
  if (!Number.isInteger(messageId)) return;

  await sql`update messages set status = 'rejected' where id = ${messageId}`;
  revalidatePath("/admin");
}
