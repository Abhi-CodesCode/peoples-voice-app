# Privacy Policy

**Last Updated:** July 2024

People's Voices is committed to protecting the privacy of every individual who uses this platform. This privacy policy explains what data we collect, how we use it, and your rights.

---

## 🔑 Core Principle

**People's Voices does not collect, store, or process any personally identifiable information (PII).** The platform is designed from the ground up to ensure complete anonymity for all participants.

---

## 🚫 What We Do NOT Collect

| Data Type | Status |
|---|---|
| Name (first, last, full) | ❌ Not collected |
| Email address | ❌ Not collected |
| Phone number | ❌ Not collected |
| Home address | ❌ Not collected |
| Precise GPS location | ❌ Not collected |
| IP address | ❌ Not stored or logged |
| Device fingerprints | ❌ Not collected |
| Browser fingerprints | ❌ Not collected |
| Social media accounts | ❌ Not collected |
| Photographs or selfies | ❌ Not collected |
| Government ID numbers | ❌ Not collected |

---

## ✅ What We DO Collect

We collect only the minimum information necessary to visualize voluntary civic participation:

### 1. City and State Selection

- Users **select** their city and state from a predefined dropdown list
- No free-form location entry is permitted
- No geolocation APIs or GPS access is used
- Location data is at the **city level only** — using pre-defined centroid coordinates (geographic center of the city), not the user's actual position

### 2. Submission Content

- Users may voluntarily submit text describing their perspective or participation
- Submissions are anonymous — there is no account, login, or identifier attached
- Content is moderated for profanity and inappropriate language

### 3. Timestamp

- The date and time of each submission is recorded
- This is used solely for displaying chronological data and trends

---

## 🍪 Cookies & Tracking

### No Tracking Cookies

People's Voices does **not** use:

- Tracking cookies
- Marketing cookies
- Analytics cookies
- Cross-site tracking pixels

### No Third-Party Analytics

We do **not** integrate with any third-party analytics services, including but not limited to:

- Google Analytics
- Facebook Pixel
- Mixpanel
- Hotjar
- Amplitude
- Any other analytics or tracking platform

### Essential Cookies Only

The only cookies that may be set are those strictly necessary for the application to function (e.g., session management by Supabase Auth if authentication features are used). These cookies:

- Are first-party only
- Contain no personally identifiable information
- Are not used for tracking or analytics
- Expire when the browser session ends

---

## 📍 Location Data Policy

### City-Level Only

- Location is determined by the user's **manual selection** from a dropdown menu
- The platform uses **centroid coordinates** — a pre-calculated geographic center point of each city
- These coordinates represent the city, **not the user's actual location**
- No geolocation permission is requested from the browser
- No GPS, Wi-Fi triangulation, or IP-based geolocation is used

### Why We Collect City Data

City and state information is used solely to:

- Display submissions on an interactive map of India
- Aggregate participation statistics by region
- Visualize geographic trends in civic participation

---

## 🗄️ Data Retention

| Data | Retention Period |
|---|---|
| Submissions | Retained while the platform is active |
| City/State selections | Retained with submissions |
| Timestamps | Retained with submissions |
| Server logs | Not retained (no logging of user data) |

- Data may be periodically reviewed and anonymized further if needed
- Users cannot request deletion of specific submissions because submissions are fully anonymous — there is no way to link a submission to an individual
- The platform operators may purge all data at the conclusion of the civic initiative

---

## 👤 User Rights

Since no personal data is collected:

- There is no user profile to access, modify, or delete
- There is no data portability concern — no personal data exists to export
- There is no consent withdrawal needed — no personal data was collected with consent

### Your Rights Under Indian Law

Under the Digital Personal Data Protection Act (DPDPA) 2023:

- You have the right to know what data is collected — this policy provides full transparency
- You have the right to correction and erasure — not applicable as no personal data is stored
- You have the right to grievance redressal — contact the project maintainers with concerns

---

## 🔒 Data Security

- All data is stored in Supabase (PostgreSQL) with Row-Level Security enabled
- All connections use HTTPS/TLS encryption
- No personal data is transmitted over the network
- Server-side keys are never exposed to the browser
- See our [Security Policy](./SECURITY.md) for full details

---

## 📝 Changes to This Policy

- This privacy policy may be updated as the platform evolves
- Material changes will be documented in the project's changelog
- The "Last Updated" date at the top will reflect the most recent revision

---

## 📬 Contact

If you have questions or concerns about this privacy policy, please open an issue on the project's GitHub repository or contact the project maintainers.

---

> **Disclaimer:** This platform visualizes voluntary submissions from individuals who choose to participate. It is intended to document participation and perspectives, not to estimate public opinion or represent the views of the general population.
