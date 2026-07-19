# Security Policy

People's Voices takes security and privacy seriously. This document outlines our security practices, data handling policies, and how to report vulnerabilities.

---

## 🔐 Supported Versions

| Version | Supported |
|---|---|
| Latest (`main`) | ✅ |
| Previous releases | ⚠️ Best effort |

---

## 🚫 Data NOT Collected

People's Voices is designed with a **privacy-first architecture**. The following data is **never** collected, stored, or transmitted:

| Data Type | Collected? |
|---|---|
| **Full Name** | ❌ Never |
| **Email Address** | ❌ Never |
| **Phone Number** | ❌ Never |
| **Precise GPS Coordinates** | ❌ Never |
| **IP Address** | ❌ Never (not logged or stored) |
| **Device Fingerprints** | ❌ Never |
| **Tracking Cookies** | ❌ Never |
| **Third-Party Analytics** | ❌ Never |

---

## ✅ Data That IS Collected

The platform collects only the **minimum data necessary** to visualize civic participation:

| Data Type | Description | Precision |
|---|---|---|
| **City** | User-selected city name | City-level |
| **State** | User-selected state name | State-level |
| **Centroid Coordinates** | Pre-defined city/state center points | Approximate (not user location) |
| **Submission Content** | User's voluntary text submission | As provided |
| **Timestamp** | When the submission was made | Date/time |

> **Important:** Centroid coordinates are pre-defined geographic center points of cities — they are **not** the user's actual location. Users select their city from a list; no geolocation APIs are used.

---

## 🛡️ Security Measures

### Row-Level Security (RLS)

All Supabase database tables are protected with **Row-Level Security** policies:

- Public read access is scoped to only the data needed for visualization
- Write access is restricted through server-side API routes
- Service role keys are **never** exposed to the client
- The `SUPABASE_SERVICE_ROLE_KEY` is used exclusively in server-side code

### Input Sanitization

- All user-submitted text is sanitized before storage
- Profanity filtering is applied using the `bad-words` library
- Maximum length limits are enforced on all text fields
- HTML tags are stripped from submissions

### XSS Prevention

- React's built-in JSX escaping prevents most XSS vectors
- No use of `dangerouslySetInnerHTML` without explicit sanitization
- Content Security Policy (CSP) headers are configured
- All user-generated content is rendered as text, never as HTML

### Authentication

- Supabase Auth with Magic Links (when applicable)
- No password storage — authentication is token-based
- JWTs are short-lived and refresh automatically

### Infrastructure

- HTTPS enforced on all connections
- Environment variables are used for all secrets
- No secrets are committed to version control
- Deployed on Vercel with automatic security updates

---

## 🐛 Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Send a detailed report via email to the project maintainers
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

| Timeline | Action |
|---|---|
| **24 hours** | Acknowledgment of your report |
| **72 hours** | Initial assessment and severity classification |
| **7 days** | Fix development and testing |
| **14 days** | Patch release (for critical vulnerabilities) |

### Scope

The following are **in scope** for security reports:

- SQL injection or NoSQL injection
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Authentication or authorization bypass
- Data exposure or privacy violations
- Server-side request forgery (SSRF)
- Any mechanism that could expose PII

The following are **out of scope**:

- Denial of service (DoS/DDoS)
- Social engineering attacks
- Issues in third-party dependencies (report to the respective project)
- Issues requiring physical access to a device

---

## 🔄 Security Updates

- Dependencies are regularly updated to patch known vulnerabilities
- Supabase security advisories are monitored
- Critical security patches are deployed within 24 hours

---

Thank you for helping keep People's Voices secure for everyone. 🙏
