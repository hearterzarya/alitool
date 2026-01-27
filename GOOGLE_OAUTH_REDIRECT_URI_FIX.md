# Google OAuth Redirect URI Mismatch Fix

## Error: `Error 400: redirect_uri_mismatch`

This error occurs when the redirect URI sent by your application doesn't match the authorized redirect URIs configured in Google Cloud Console.

## Quick Fix Steps

### 1. Check Your Current Environment

**Development (localhost):**
- `NEXTAUTH_URL="http://localhost:3000"`
- Redirect URI: `http://localhost:3000/api/auth/callback/google`

**Production:**
- `NEXTAUTH_URL="https://alidigitalsolution.in"`
- Redirect URI: `https://alidigitalsolution.in/api/auth/callback/google`

### 2. Update Google Cloud Console (REQUIRED - Do This First!)

**⚠️ IMPORTANT: You MUST add BOTH redirect URIs to Google Cloud Console for it to work in both environments.**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 Client ID (check your `.env.local` file for `GOOGLE_CLIENT_ID`)
5. Click **Edit** (pencil icon)
6. Under **Authorized redirect URIs**, click **+ ADD URI** and add BOTH:
   - `http://localhost:3000/api/auth/callback/google` (for localhost development)
   - `https://alidigitalsolution.in/api/auth/callback/google` (for Vercel production)
7. Click **Save**
8. **Wait 1-2 minutes** for changes to propagate

### 3. Verify Environment Variables

**For Development (.env.local):**
```env
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**For Production (Vercel/Environment Variables):**
```env
NEXTAUTH_URL="https://alidigitalsolution.in"
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 4. Important Notes

- **Exact Match Required**: The redirect URI must match EXACTLY (including http/https, trailing slashes, etc.)
- **No Trailing Slash**: Use `http://localhost:3000/api/auth/callback/google` NOT `http://localhost:3000/api/auth/callback/google/`
- **Case Sensitive**: Domain names are case-insensitive, but the path is case-sensitive
- **Both Environments**: Add both development and production URIs to Google Cloud Console

### 5. Common Mistakes to Avoid

❌ **Wrong:**
- `http://localhost:3000/api/auth/callback/google/` (trailing slash)
- `https://localhost:3000/api/auth/callback/google` (https on localhost)
- `http://localhost:3000/api/auth/callback/Google` (wrong case)

✅ **Correct:**
- `http://localhost:3000/api/auth/callback/google`
- `https://alidigitalsolution.in/api/auth/callback/google`

### 6. After Making Changes

1. **Save changes in Google Cloud Console**
2. **Wait 1-2 minutes** for changes to propagate
3. **Restart your development server** if running locally
4. **Clear browser cache/cookies** for the Google account
5. **Try signing in again**

### 7. Verify It's Working

After updating Google Cloud Console:
1. Go to your login page
2. Click "Sign in with Google"
3. You should be redirected to Google's consent screen (not the error page)
4. After authorizing, you should be redirected back to your app

## Troubleshooting

### Still Getting the Error?

1. **Double-check the redirect URI format** in Google Cloud Console
2. **Verify NEXTAUTH_URL** matches your current environment
3. **Check for typos** in the redirect URI
4. **Ensure you're using the correct OAuth Client ID** (check `GOOGLE_CLIENT_ID` in your `.env.local`)
5. **Wait a few minutes** after saving in Google Cloud Console (changes can take time to propagate)

### Check Current Redirect URI

The redirect URI NextAuth uses is:
```
{NEXTAUTH_URL}/api/auth/callback/google
```

So if `NEXTAUTH_URL="http://localhost:3000"`, the redirect URI is:
```
http://localhost:3000/api/auth/callback/google
```

Make sure this EXACT string is in your Google Cloud Console authorized redirect URIs list.

## Production Deployment (Vercel) - Complete Setup

### Step 1: Add Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **alitool** (or your project name)
3. Go to **Settings** > **Environment Variables**
4. Add the following variables (one by one):

**Required Variables:**
```
NEXTAUTH_URL = https://alidigitalsolution.in
GOOGLE_CLIENT_ID = (your-client-id from .env.local)
GOOGLE_CLIENT_SECRET = (your-client-secret from .env.local)
NEXTAUTH_SECRET = (your-nextauth-secret from .env.local)
```

**Important Settings for Each Variable:**
- **Environment**: Select **Production**, **Preview**, and **Development** (or at least **Production**)
- Click **Save** after adding each variable

### Step 2: Verify Google Cloud Console

**Before deploying, make sure BOTH redirect URIs are in Google Cloud Console:**
- ✅ `http://localhost:3000/api/auth/callback/google` (for localhost)
- ✅ `https://alidigitalsolution.in/api/auth/callback/google` (for Vercel)

### Step 3: Redeploy Application

1. After adding all environment variables in Vercel
2. Go to **Deployments** tab
3. Click **...** (three dots) on the latest deployment
4. Click **Redeploy**
5. Or push a new commit to trigger a new deployment

### Step 4: Test Production

1. Wait for deployment to complete
2. Go to `https://alidigitalsolution.in/login`
3. Click "Sign in with Google"
4. Should redirect to Google OAuth (not show error)

## Summary: What You Need to Do

### ✅ For Localhost (Development):
1. Keep `.env.local` with:
   - `NEXTAUTH_URL="http://localhost:3000"`
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (already set)
2. Add to Google Cloud Console: `http://localhost:3000/api/auth/callback/google`

### ✅ For Vercel (Production):
1. Add to Vercel Environment Variables:
   - `NEXTAUTH_URL="https://alidigitalsolution.in"`
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (same as localhost)
2. Add to Google Cloud Console: `https://alidigitalsolution.in/api/auth/callback/google`
3. Redeploy on Vercel

### ✅ Google Cloud Console:
**Add BOTH redirect URIs:**
- `http://localhost:3000/api/auth/callback/google`
- `https://alidigitalsolution.in/api/auth/callback/google`
