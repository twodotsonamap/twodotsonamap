const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects inline <script> tags of its own — the RSC streaming
  // payload (__next_f pushes) on every page, plus (in dev) the Fast Refresh
  // runtime, which also needs eval(). Next can nonce its own inline scripts
  // automatically, but only on pages forced into per-request dynamic
  // rendering (see the content-security-policy guide's "How nonces work"
  // section) — not worth opting this app's static homepage into dynamic
  // rendering just to satisfy CSP. So script-src allows 'unsafe-inline'
  // (and, dev-only, 'unsafe-eval'). This isn't the primary XSS defense here
  // anyway — nothing in this app uses dangerouslySetInnerHTML, so user
  // content always goes through React's automatic escaping regardless of
  // CSP. What this policy still meaningfully blocks: loading scripts from
  // any other origin, framing this site, and cross-origin form submission.
  isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
