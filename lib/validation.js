import { z } from "zod";

// Bot-catching fields added to the drop form. `website` is a classic
// honeypot: real visitors never see or fill it (hidden off-screen), but
// generic form-filling bots often populate every input. `renderedAt` records
// when the form appeared, so a submission that arrives implausibly fast
// (well under human reaction/typing time) can be rejected as scripted.
export const HONEYPOT_FIELD = "website";
export const RENDERED_AT_FIELD = "renderedAt";
export const MIN_SUBMIT_MS = 1500;

// Strips ASCII control characters (keeping newline/tab/carriage-return,
// which plain text messages may legitimately contain) before anything is
// validated or stored. This is defense in depth: React already escapes text
// when rendering, so this isn't the only thing preventing markup from
// executing, but it keeps junk bytes (e.g. terminal escape sequences) out of
// the database entirely.
function stripControlChars(value) {
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0);
    const isControl = code < 32 || code === 127;
    const isAllowedWhitespace = ch === "\n" || ch === "\t" || ch === "\r";
    if (!isControl || isAllowedWhitespace) {
      out += ch;
    }
  }
  return out;
}

function cleanText(value) {
  return stripControlChars(value).trim();
}

const requiredField = (max, label) =>
  z
    .string()
    .transform(cleanText)
    .pipe(z.string().min(3, `${label} must be at least 3 characters`).max(max));

export const dropMailSchema = z.object({
  name: requiredField(80, "Name"),
  location: requiredField(100, "Location"),
  body: requiredField(1000, "Message"),
});
