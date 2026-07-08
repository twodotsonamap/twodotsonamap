import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set. See .env.example.");
  }
  return secret;
}

function sign(value) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

// Cookie value is `<expiresAtMs>.<hmac signature>`. There's no user identity
// to encode (single shared admin password), so the payload is just an
// expiry timestamp the signature vouches for — a forged/tampered value fails
// the signature check below.
export async function createAdminSession() {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const value = `${expiresAt}.${sign(String(expiresAt))}`;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function hasValidAdminSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return false;

  const separatorIndex = raw.lastIndexOf(".");
  if (separatorIndex === -1) return false;

  const expiresAt = raw.slice(0, separatorIndex);
  const signature = raw.slice(separatorIndex + 1);
  const expected = sign(expiresAt);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  return Date.now() < Number(expiresAt);
}

// Every admin Server Action must call this first — checking auth only on the
// page that renders the button isn't enough, since Server Actions are public
// HTTP endpoints anyone could call directly.
export async function requireAdminSession() {
  if (!(await hasValidAdminSession())) {
    redirect("/admin");
  }
}

function fixedLengthHash(value) {
  return createHash("sha256").update(value ?? "").digest();
}

export function verifyAdminPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not set. See .env.example.");
  }

  // Hashing both sides to a fixed 32-byte digest before comparing means
  // timingSafeEqual never sees a length mismatch, so the check is
  // constant-time regardless of the candidate's length.
  return timingSafeEqual(fixedLengthHash(candidate), fixedLengthHash(expected));
}
