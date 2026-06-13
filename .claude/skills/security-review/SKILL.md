---
name: security-review
description: >
  Security audit of the CV site's interactive features — primarily focused on anti-spam
  and anti-flood protection for the Hire Me contact form, booking modal, and other
  user-facing endpoints. Reads current implementation in shared.js and config.js,
  identifies gaps, and produces a prioritized report with concrete fix recommendations.
  Does not auto-fix — human applies changes.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: false
argument-hint: "[--fix]"
---

# security-review — Anti-Spam & Security Audit

You are a web security specialist focused on protecting static CV sites from abuse.
The site has no backend — it relies on Formspree (contact form) and Google Apps Script (booking).
Your job is to audit ALL user-facing interactive features for spam, flood, and injection risks.

**This is a static site. Server-side rate limiting is not available. Client-side protections
are your primary defense — but they must be layered and not easily bypassed.**

---

## Step 1 — Inventory interactive features

Read the following files in full:
- `scripts/shared.js` — Hire Me modal and Booking modal implementation
- `scripts/config.js` — feature flags, endpoint URLs, storage keys
- `scripts/cv-music-player.js` (if exists) — music player
- Any `cv-*.js` files that contain additional form or submission logic

Identify ALL features that:
- Send external HTTP requests (`fetch`, `XMLHttpRequest`)
- Store user state in `localStorage` or `sessionStorage`
- Accept user-provided text input
- Inject content into the DOM from user input

Build: `FEATURES = [{ name, type, endpoint, inputs, rate_limit_mechanism }]`

---

## Step 2 — Audit: Hire Me form (Formspree)

### 2a — Rate limiting

- Is there a `localStorage` cooldown after sending? What is the duration?
- Is the cooldown key hardcoded or from `config.js`?
- **Bypass risk**: `localStorage` can be cleared by the user. Is this the ONLY gate?
- Is there a honeypot field (hidden input that bots fill but humans don't)?
- Is there a minimum time-on-page check before submit is allowed?

### 2b — Input validation

- Is there a minimum message length check? What is the threshold?
- Is there a minimum word count check?
- Is there a name field minimum length check?
- Is the email format validated with regex?
- Is the email domain validated via DoH MX lookup (CHECK_EMAIL_DOMAIN flag)?
- Are there any character blacklists or URL-in-message detection?
- Is there a maximum message length to prevent payload bloat?

### 2c — Bot protection

- Is there a honeypot field? (`<input type="hidden">` or visually hidden, that bots fill)
- Is there a CAPTCHA? (hCaptcha, Cloudflare Turnstile, reCAPTCHA)
- Is the submit button disabled after first click to prevent double-submit?
- Is there any timing check (e.g. form submitted < 2 seconds after page load = bot)?

### 2d — Endpoint exposure

- Is the Formspree endpoint URL visible in the JS source? (It will be — assess risk)
- Is the Formspree form protected by Formspree's own spam filters?
- Note: Formspree has built-in spam filtering and domain restrictions — verify if configured

### 2e — XSS risk

- Is user input ever injected into the DOM with `.innerHTML`?
- Is `escHtml()` or the `html\`\`` tag used for any dynamic content in modals?
- Are error messages from the server ever rendered as HTML?

---

## Step 3 — Audit: Booking modal (Google Apps Script)

### 3a — Rate limiting

- Is there a `localStorage` cooldown after booking? What is the duration (48h)?
- Same bypass risk as hire form — assess whether this is sufficient
- Does the Google Apps Script endpoint have its own rate limiting?

### 3b — Slot availability validation

- Is the selected slot validated client-side before submission?
- Could a user forge a slot request by manipulating the fetch parameters?
- Is `selectedSlot.start` and `selectedSlot.end` sanitized before being sent?

### 3c — Bot protection

- Is there a honeypot field on the booking form? (`#[prefix]-bk-hp` was found in code — verify it's checked)
- Is the honeypot check actually enforced? (Look for: `if (document.getElementById(p + '-bk-hp').value) return;`)
- Is there any timing or behavior check?

### 3d — Endpoint exposure

- Is the `BOOKING_SCRIPT_URL` (Google Apps Script URL) in `config.js` or hardcoded?
- Note: Script URLs are inherently exposed on a static site — assess what someone could do if they call it directly
- Can an attacker submit bookings for arbitrary time slots by calling the GAS endpoint directly?
- Does the GAS validate that the slot is actually free, or does it trust client input?

### 3e — Input validation

- Is topic/message minimum length enforced?
- Is there a maximum length limit?
- Are name and email validated the same way as the hire form?

---

## Step 4 — Audit: Other features

### 4a — Music player

- Does it make any external requests that could be abused? (track loading, etc.)
- Any state stored in localStorage that could be manipulated to cause issues?

### 4b — Theme toggle

- Pure client-side — no risk. Note as ✅ safe.

### 4c — Language selector

- Pure client-side — no risk. Note as ✅ safe.

### 4d — Any other fetch() calls

Scan all JS files for `fetch(` calls not already audited.
For each: note the URL, what data is sent, and whether it's user-controlled.

---

## Step 5 — Risk matrix

Build a risk matrix for all findings:

| Finding | Feature | Severity | Bypass difficulty | Recommended fix |
|---|---|---|---|---|
| No honeypot on hire form | Hire Me | HIGH | Easy (any bot) | Add honeypot field |
| localStorage only rate limit | Hire Me + Booking | MEDIUM | Easy (clear storage) | Add server-side token |
| No max message length | Hire Me | LOW | Trivial | Add maxlength attribute |
| GAS endpoint accepts arbitrary slots | Booking | HIGH | Medium (requires inspection) | Validate slot server-side |
| ... | ... | ... | ... | ... |

Severity:
- **CRITICAL**: Can be exploited by anyone, immediately, to flood inboxes or calendar
- **HIGH**: Easy exploit with minor effort (incognito, DevTools)
- **MEDIUM**: Requires moderate effort or technical knowledge
- **LOW**: Theoretical, low-impact, or hard to exploit at scale

---

## Step 6 — Recommendations

For each HIGH or CRITICAL finding, provide a concrete implementation suggestion.

Since this is a **static site with no backend**, recommendations must be:
- Client-side enhancements (layered rate limiting, honeypot, timing checks)
- Third-party service configuration (Formspree spam settings, GAS server-side validation)
- Free/no-backend solutions (Cloudflare Turnstile CAPTCHA, hCaptcha)

### Template for each recommendation:

```
### [Finding name] — [CRITICAL/HIGH/MEDIUM/LOW]

**Probléma:** [What can happen if not fixed]

**Érintett fájl(ok):** [e.g. scripts/shared.js:172, scripts/config.js]

**Javasolt javítás:**
[Specific, implementable suggestion — code snippet if helpful]

**Erőfeszítés:** [Alacsony / Közepes / Magas]
**Hatás:** [What this prevents if implemented]
```

---

## Step 7 — Report

Generate filename:
```
DATE  = today YYYY-MM-DD
TIME  = current time HHMM
FILENAME = review/DATE_TIME_security-review.md
```

Create `review/` if it does not exist.

Write report to `FILENAME` regardless of whether issues were found:

```markdown
# Biztonsági Átvizsgálás — CV Site
**Típus:** security-review
**Dátum:** YYYY-MM-DD HH:MM
**Összesítés:** N kritikus · N magas · N közepes · N alacsony
**Fókusz:** Spam / flood védelem — Hire Me + Booking + egyéb felületek

---

## Összefoglalás

| Súlyosság | Darab |
|---|---|
| 🔴 KRITIKUS | N |
| 🟠 MAGAS | N |
| 🟡 KÖZEPES | N |
| 🟢 ALACSONY | N |

---

## Kockázati mátrix

[Risk matrix table from Step 5]

---

## Részletes megállapítások és javaslatok

[Each recommendation from Step 6, ordered by severity]

---

## Biztonságos elemek

[Features confirmed safe]

---

*Generálta: /security-review skill*
```

Display summary to user:

```
🔒 Biztonsági átvizsgálás kész

🔴 Kritikus: N | 🟠 Magas: N | 🟡 Közepes: N | 🟢 Alacsony: N

Legfontosabb teendők:
  • [top critical/high finding]
  • [second finding]

Riport: review/FILENAME
```

---

## Step 8 — Fix mode (only if --fix passed)

If `--fix` was passed AND findings are purely client-side changes in `shared.js` or `config.js`:
Show the exact code changes for CRITICAL and HIGH findings.
Ask for confirmation before each change.
Apply confirmed changes one at a time.

Do NOT auto-fix:
- Anything requiring a new external service (CAPTCHA)
- Google Apps Script server-side validation (not in this repo)
- Formspree configuration (done via Formspree dashboard)

---

## Hard Constraints

- ❌ Never auto-apply security changes without explicit user confirmation per change
- ❌ Never suggest security measures that require a backend (this is a static site)
- ❌ Never flag Formspree/GAS URL exposure as CRITICAL — it is inherent to static sites
- ✅ Focus on realistic attack scenarios: automated bots, script kiddies, motivated individuals
- ✅ Prioritize: inbox flood and calendar flood are the primary risks to protect against
- ✅ All recommendations must be implementable without a build step (Vanilla JS, no npm)
- ✅ All user-facing output and report content in Hungarian; code samples in English
