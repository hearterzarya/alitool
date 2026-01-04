# GrowTools - Vercel Deployment Guide

## Problem: 404 NOT_FOUND Error

If you're seeing a 404 error on Vercel, it's because the project has a **monorepo structure** with the Next.js app in the `/client` subdirectory, but Vercel is trying to deploy from the root directory.

## Solution: Two Options

### Option 1: Use vercel.json (Recommended) ✅

A `vercel.json` file has been created in the root directory with the correct configuration. This will automatically configure Vercel to build from the `/client` directory.

**Steps:**
1. Push the latest changes (including `vercel.json`)
2. Redeploy on Vercel
3. It should work automatically

### Option 2: Configure in Vercel Dashboard

If Option 1 doesn't work, manually configure in Vercel:

1. **Go to Vercel Dashboard:**
   - Open your project settings
   - Go to "Settings" → "General"

2. **Configure Root Directory:**
   - Find "Root Directory" setting
   - Click "Edit"
   - Set to: `client`
   - Save changes

3. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Redeploy:**
   - Go to "Deployments"
   - Click "..." on latest deployment
   - Click "Redeploy"

---

## Environment Variables Setup

You MUST configure these environment variables in Vercel:

### Required Environment Variables

1. **Go to Vercel Dashboard:**
   - Your project → Settings → Environment Variables

2. **Add these variables:**

```env
# Database (Required)
DATABASE_URL=your_postgresql_connection_string

# NextAuth (Required)
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Cookie Encryption (Required)
COOKIE_ENCRYPTION_KEY=your_32_char_encryption_key

# Stripe (If using payments)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_EXTENSION_ID=your-chrome-extension-id
```

### How to Generate Secret Keys

**NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**COOKIE_ENCRYPTION_KEY:**
```bash
openssl rand -hex 32
```

---

## Database Setup for Production

### Option 1: Use Supabase (Recommended)

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Create new project
   - Wait for database to provision

2. **Get Connection String:**
   - Go to Project Settings → Database
   - Find "Connection string" → "URI"
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password

3. **Add to Vercel:**
   - Paste in `DATABASE_URL` environment variable
   - Make sure it's in this format:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
     ```

4. **Run Migrations:**
   ```bash
   # Locally, with DATABASE_URL set to production
   cd client
   npx prisma db push
   ```

### Option 2: Use Vercel Postgres

1. **In Vercel Dashboard:**
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Click "Create"

2. **Connect to Project:**
   - Select your project
   - Click "Connect"
   - Environment variables will be added automatically

3. **Run Migrations:**
   ```bash
   cd client
   npx prisma db push
   ```

---

## Build Configuration Check

Your `package.json` should have these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "db:generate": "prisma generate"
  }
}
```

**Important:** Prisma needs to generate the client before building:

Add this to your build process. Update `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start"
  }
}
```

---

## Deployment Checklist

Before deploying to production:

- [ ] **Environment Variables Set:**
  - [ ] DATABASE_URL configured
  - [ ] NEXTAUTH_SECRET generated and set
  - [ ] NEXTAUTH_URL set to your domain
  - [ ] COOKIE_ENCRYPTION_KEY generated and set

- [ ] **Database Setup:**
  - [ ] Database created (Supabase or Vercel Postgres)
  - [ ] Connection string added to DATABASE_URL
  - [ ] `prisma db push` executed successfully
  - [ ] Seed data added (optional)

- [ ] **Build Configuration:**
  - [ ] Root directory set to `client` OR `vercel.json` present
  - [ ] Build command includes `prisma generate`
  - [ ] Output directory is `.next`

- [ ] **Domain Configuration:**
  - [ ] NEXTAUTH_URL matches your domain
  - [ ] NEXT_PUBLIC_APP_URL matches your domain
  - [ ] Custom domain configured (if needed)

- [ ] **Extension Configuration:**
  - [ ] Extension manifest.json updated with production domain
  - [ ] NEXT_PUBLIC_EXTENSION_ID set (if published)

---

## Common Issues & Solutions

### Issue 1: 404 NOT_FOUND
**Cause:** Wrong root directory
**Solution:** Use `vercel.json` or set Root Directory to `client`

### Issue 2: Build Failed - Prisma Error
**Cause:** DATABASE_URL not set or Prisma client not generated
**Solution:**
1. Add DATABASE_URL to environment variables
2. Update build command to: `prisma generate && next build`

### Issue 3: Module Not Found Errors
**Cause:** Dependencies not installed in correct directory
**Solution:**
- Check `vercel.json` has correct `installCommand`
- Ensure it runs in `/client` directory

### Issue 4: Environment Variables Not Working
**Cause:** Variables not set in Vercel or wrong scope
**Solution:**
1. Go to Settings → Environment Variables
2. Make sure they're set for "Production" scope
3. Redeploy after adding variables

### Issue 5: Database Connection Failed
**Cause:** Wrong connection string or SSL issue
**Solution:**
1. Check DATABASE_URL format
2. For Supabase, add `?sslmode=require` if needed:
   ```
   postgresql://user:pass@host:5432/db?sslmode=require
   ```

### Issue 6: NextAuth Errors
**Cause:** NEXTAUTH_SECRET or NEXTAUTH_URL missing/incorrect
**Solution:**
1. Generate new NEXTAUTH_SECRET: `openssl rand -base64 32`
2. Set NEXTAUTH_URL to your exact Vercel URL (with https://)
3. Redeploy

---

## Testing Deployment

After deploying, test these:

1. **Homepage loads:** Visit your Vercel URL
2. **Tools page works:** `/tools`
3. **Login works:** `/login`
4. **Registration works:** `/register`
5. **Dashboard requires auth:** `/dashboard` redirects if not logged in
6. **Admin panel protected:** `/admin` requires admin role

---

## Vercel CLI Deployment (Alternative)

You can also deploy using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /path/to/growtools
vercel

# Follow prompts:
# - Link to existing project? Yes
# - What's the root directory? client
```

For production deployment:
```bash
vercel --prod
```

---

## Prisma in Production

After deploying, you need to push your database schema:

```bash
# Set DATABASE_URL to your production database
export DATABASE_URL="your_production_database_url"

# Push schema
cd client
npx prisma db push

# Seed data (optional)
npm run db:seed
```

**Or** add to `package.json` build script:
```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build"
  }
}
```

⚠️ **Warning:** `prisma db push` in production can be risky. Consider using migrations instead.

---

## Production URL Update

After deploying, update these:

1. **Extension manifest.json:**
   ```json
   {
     "content_scripts": [
       {
         "matches": ["https://your-domain.vercel.app/*"]
       }
     ]
   }
   ```

2. **NEXTAUTH_URL:**
   ```env
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **NEXT_PUBLIC_APP_URL:**
   ```env
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

---

## Custom Domain Setup (Optional)

1. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Click "Add"
   - Enter your domain (e.g., `growtools.com`)
   - Follow DNS configuration instructions

2. **Update Environment Variables:**
   ```env
   NEXTAUTH_URL=https://growtools.com
   NEXT_PUBLIC_APP_URL=https://growtools.com
   ```

3. **Update Extension:**
   - Update manifest.json with new domain
   - Republish extension

---

## Monitoring & Logs

**View Deployment Logs:**
1. Go to Vercel Dashboard
2. Click on deployment
3. View "Build Logs" for build issues
4. View "Runtime Logs" for production errors

**Common Log Errors:**
- **Prisma errors:** Check DATABASE_URL
- **Module not found:** Check install command
- **Next.js errors:** Check build configuration

---

## Need Help?

If you're still getting 404 errors:

1. Check the `vercel.json` file exists in root
2. Verify environment variables are set
3. Check build logs for errors
4. Try redeploying
5. Contact Vercel support if issue persists

**Quick Fix Commands:**
```bash
# Push vercel.json
git add vercel.json VERCEL_DEPLOYMENT_GUIDE.md
git commit -m "Add Vercel deployment configuration"
git push

# Then redeploy on Vercel dashboard
```

---

Good luck with your deployment! 🚀
