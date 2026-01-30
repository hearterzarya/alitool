# Vercel Setup Guide

Use this checklist when deploying **alitool** to Vercel (e.g. alidigitalsolution.in).

---

## 1. Connect the repo

- In [Vercel Dashboard](https://vercel.com/dashboard), import your GitHub repo (**hearterzarya/alitool**).
- **Framework Preset:** Next.js (auto-detected).
- **Root Directory:** leave default (project root).
- **Build Command:** `npm run build` (default).
- **Output Directory:** `.next` (default).

---

## 2. Environment variables

In **Vercel → Your Project → Settings → Environment Variables**, add these.

### Required (app won’t work without them)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Neon, Supabase, etc.) | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth sessions | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL | `https://alidigitalsolution.in` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | From Google Cloud Console |
| `RESEND_API_KEY` | Resend.com API key (transactional email) | From Resend dashboard |
| `EMAIL_FROM` | Sender email for transactional emails | `noreply@alidigitalsolution.in` |

### Recommended

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Public site URL (emails, links). e.g. `https://alidigitalsolution.in` |
| `EMAIL_FROM_NAME` | Sender name in emails. e.g. `AliDigitalSolution` |
| `PAYGIC_MERCHANT_ID` | Paygic payment gateway (if using payments) |
| `PAYGIC_PASSWORD` | Paygic password |
| `CRON_SECRET` | Secret for cron endpoint `/api/subscriptions/validate` (set in Vercel Cron) |

### Optional (features)

| Variable | Description |
|----------|-------------|
| `WHATSAPP_NUMBER` | Default WhatsApp support number (or set in Admin → Settings) |
| `WHATSAPP_DEFAULT_MESSAGE` | Default pre-filled WhatsApp message |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (e.g. `G-XXXXXXXXXX`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (bundle/tool icon uploads; else uses local `public/`) |
| `COOKIE_ENCRYPTION_KEY` | Key for cookie encryption (or default is used) |

### Firebase (optional; app has fallback config in code)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `alitool-a5847.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | e.g. `alitool-a5847` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | e.g. `alitool-a5847.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase Analytics (e.g. `G-8JLJVTG8CF`) |

Meta Pixel is configured from **Admin → Settings** (stored in DB), not env.

---

## 3. Apply to the right environment

- For **Production** (alidigitalsolution.in): add variables and select **Production**.
- You can also add the same (or different) values for **Preview** if you use preview deployments.

---

## 4. Database and migrations

- **Neon / Supabase:** Ensure `DATABASE_URL` in Vercel is the **pooler/direct** URL that accepts connections from the internet.
- Run migrations **once** against the production DB (from your machine or a one-off script):
  ```bash
  DATABASE_URL="your-production-url" npx prisma migrate deploy
  ```
- The build runs `prisma generate` only; it does **not** run migrations.

---

## 5. Cron (subscription validation)

The project’s `vercel.json` defines a cron that hits `/api/subscriptions/validate` daily. In Vercel:

- **Vercel → Project → Settings → Crons** (or **Functions**): ensure the cron is enabled.
- If your API checks `CRON_SECRET`, set that header in the Vercel Cron config to match `CRON_SECRET` in env.

---

## 6. Custom domain

- **Vercel → Project → Settings → Domains**: add `alidigitalsolution.in` (and www if needed).
- Point your domain’s DNS to Vercel (A/CNAME as shown in the dashboard).
- After DNS propagates, Vercel will issue SSL automatically.

---

## 7. After deploy

1. Open `https://alidigitalsolution.in` and confirm the site loads.
2. Test login (email + Google if configured).
3. In **Admin → Settings**, set WhatsApp number and Meta Pixel if needed.
4. Confirm payments (Paygic) and emails (Resend) if you use them.

---

## Quick checklist

- [ ] Repo connected, build command `npm run build`
- [ ] `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` set
- [ ] Google OAuth and Resend + `EMAIL_FROM` set
- [ ] `NEXT_PUBLIC_APP_URL` = production URL
- [ ] Paygic and `CRON_SECRET` set if you use them
- [ ] Production DB migrated (`prisma migrate deploy`)
- [ ] Custom domain added and DNS pointed to Vercel
- [ ] Post-deploy: Admin Settings (WhatsApp, Pixel), login, and payments tested
