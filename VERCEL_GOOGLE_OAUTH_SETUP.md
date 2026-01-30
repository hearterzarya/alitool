# Complete Vercel + Google OAuth Setup Guide

This guide will help you set up Google OAuth to work on both **localhost** and **Vercel production**.

---

## Google sign-in not working? Quick checks

| Symptom | Fix |
|--------|-----|
| **"Sign in with Google" button is missing** | Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in Vercel (and locally in `.env.local`). No placeholders — use real values from Google Cloud Console. Redeploy. |
| **Button shows but click does nothing / redirects to error** | Add the **exact** redirect URI in Google Cloud Console: `https://alidigitalsolution.in/api/auth/callback/google` (no trailing slash). Set `NEXTAUTH_URL=https://alidigitalsolution.in` in Vercel. Redeploy. |
| **"redirect_uri_mismatch" on Google’s page** | In Google Cloud Console → Credentials → your OAuth client → **Authorized redirect URIs**, add exactly: `https://alidigitalsolution.in/api/auth/callback/google`. Save and wait 1–2 minutes. |
| **"Access blocked" or "App not verified"** | If your OAuth consent screen is in **Testing** mode, add your Google account (and any test users) under **Test users**. Or publish the app for production use. |
| **Works on localhost but not on Vercel** | Ensure all four vars are in Vercel: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. `NEXTAUTH_URL` must be `https://alidigitalsolution.in` (not localhost). Redeploy after changing env. |

---

## Prerequisites

- Vercel account with your project deployed
- Google Cloud Console access
- Your OAuth Client ID (check your `.env.local` file for `GOOGLE_CLIENT_ID`)

## Step 1: Configure Google Cloud Console (REQUIRED)

**This is the most important step! Both redirect URIs must be added.**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 Client ID (check your `.env.local` file for `GOOGLE_CLIENT_ID`)
5. Click **Edit** (pencil icon)
6. Scroll to **Authorized redirect URIs**
7. Click **+ ADD URI** and add:
   - `http://localhost:3000/api/auth/callback/google`
8. Click **+ ADD URI** again and add:
   - `https://alidigitalsolution.in/api/auth/callback/google`
9. Click **Save** at the bottom
10. **Wait 1-2 minutes** for changes to propagate

## Step 2: Configure Vercel Environment Variables

### 2.1 Access Vercel Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: **alitool** (or your project name)
3. Click **Settings** (gear icon in top navigation)
4. Click **Environment Variables** in the left sidebar

### 2.2 Add Required Variables

Add each variable one by one:

#### Variable 1: NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: `https://alidigitalsolution.in`
- **Environment**: Select **Production**, **Preview**, and **Development**
- Click **Save**

#### Variable 2: GOOGLE_CLIENT_ID
- **Key**: `GOOGLE_CLIENT_ID`
- **Value**: (Copy from your `.env.local` file - same value as localhost)
- **Environment**: Select **Production**, **Preview**, and **Development**
- Click **Save**

#### Variable 3: GOOGLE_CLIENT_SECRET
- **Key**: `GOOGLE_CLIENT_SECRET`
- **Value**: (Copy from your `.env.local` file - same value as localhost)
- **Environment**: Select **Production**, **Preview**, and **Development**
- Click **Save**

#### Variable 4: NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: (Copy from your `.env.local` file - same value as localhost)
- **Environment**: Select **Production**, **Preview**, and **Development**
- Click **Save**

### 2.3 Verify All Variables Are Added

You should see these 4 variables in your Vercel environment variables list:
- ✅ `NEXTAUTH_URL`
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `NEXTAUTH_SECRET`

## Step 3: Redeploy Application

After adding environment variables, you need to redeploy:

### Option A: Redeploy from Dashboard
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click **...** (three dots menu)
4. Click **Redeploy**
5. Wait for deployment to complete

### Option B: Push New Commit
1. Make a small change (or just commit)
2. Push to your repository
3. Vercel will automatically deploy

## Step 4: Test Both Environments

### Test Localhost (Development)
1. Make sure `.env.local` has:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```
2. Restart your dev server: `npm run dev`
3. Go to `http://localhost:3000/login`
4. Click "Sign in with Google"
5. Should redirect to Google OAuth (not show error)

### Test Vercel (Production)
1. Go to `https://alidigitalsolution.in/login`
2. Click "Sign in with Google"
3. Should redirect to Google OAuth (not show error)
4. After authorizing, should redirect back to your app

## Troubleshooting

### Still Getting `redirect_uri_mismatch` Error?

1. **Double-check Google Cloud Console:**
   - Both URIs must be added exactly:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://alidigitalsolution.in/api/auth/callback/google`
   - No trailing slashes
   - Exact case matching

2. **Verify Vercel Environment Variables:**
   - Go to Vercel > Settings > Environment Variables
   - Make sure `NEXTAUTH_URL` is `https://alidigitalsolution.in` (not localhost)
   - All variables should be set for **Production** environment

3. **Wait and Clear Cache:**
   - Google Cloud Console changes can take 1-2 minutes to propagate
   - Clear browser cache/cookies
   - Try in incognito/private window

4. **Check Vercel Deployment:**
   - Make sure latest deployment includes the environment variables
   - Check deployment logs for any errors

### Common Mistakes

❌ **Wrong:**
- `https://localhost:3000/api/auth/callback/google` (https on localhost)
- `http://alidigitalsolution.in/api/auth/callback/google` (http instead of https)
- `https://alidigitalsolution.in/api/auth/callback/google/` (trailing slash)

✅ **Correct:**
- `http://localhost:3000/api/auth/callback/google`
- `https://alidigitalsolution.in/api/auth/callback/google`

## Quick Checklist

Before testing, verify:

- [ ] Both redirect URIs added to Google Cloud Console
- [ ] All 4 environment variables added to Vercel
- [ ] Vercel variables set for Production environment
- [ ] Application redeployed on Vercel
- [ ] Waited 1-2 minutes after Google Cloud Console changes
- [ ] Cleared browser cache

## Need Help?

If you're still having issues:
1. Check Vercel deployment logs for errors
2. Check browser console for errors
3. Verify environment variables are actually set in Vercel
4. Make sure you're using the correct OAuth Client ID
