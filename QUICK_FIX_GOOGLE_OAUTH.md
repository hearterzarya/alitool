# Quick Fix: Google OAuth for Localhost + Vercel

## 🚀 Quick Steps (5 minutes)

### Step 1: Google Cloud Console (REQUIRED)
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth Client ID (check your `.env.local` file for `GOOGLE_CLIENT_ID`)
3. Click **Edit**
4. Under **Authorized redirect URIs**, add BOTH:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://alidigitalsolution.in/api/auth/callback/google`
5. Click **Save**
6. Wait 1-2 minutes

### Step 2: Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) > Your Project > Settings > Environment Variables
2. Add these 4 variables (set for **Production**, **Preview**, **Development**):
   ```
   NEXTAUTH_URL = https://alidigitalsolution.in
   GOOGLE_CLIENT_ID = (your-client-id from .env.local)
   GOOGLE_CLIENT_SECRET = (your-client-secret from .env.local)
   NEXTAUTH_SECRET = (your-nextauth-secret from .env.local)
   ```
3. Redeploy your application

### Step 3: Test
- **Localhost**: `http://localhost:3000/login` → Click "Sign in with Google"
- **Production**: `https://alidigitalsolution.in/login` → Click "Sign in with Google"

## ✅ Checklist

- [ ] Both redirect URIs added to Google Cloud Console
- [ ] All 4 environment variables added to Vercel
- [ ] Vercel variables set for Production environment
- [ ] Application redeployed on Vercel
- [ ] Waited 1-2 minutes after Google Cloud Console changes

## 📚 Detailed Guides

- **Full Vercel Setup**: See `VERCEL_GOOGLE_OAUTH_SETUP.md`
- **Redirect URI Fix**: See `GOOGLE_OAUTH_REDIRECT_URI_FIX.md`
