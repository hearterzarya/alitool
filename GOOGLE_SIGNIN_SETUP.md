# Google Sign-in Setup Instructions

## Quick Fix for "Google sign-in is not configured" Error

This error means the Google OAuth credentials are not set in your environment variables.

## Step-by-Step Setup

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure OAuth consent screen first:
   - User Type: External
   - App name: AliDigitalSolution
   - Support email: your email
   - Developer contact: your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: AliDigitalSolution Web Client
   - **Authorized redirect URIs**: Add these:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://alidigitalsolution.in/api/auth/callback/google` (for production)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### 2. Add to Environment Variables

Add these to your `.env` or `.env.local` file:

```env
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
NEXTAUTH_URL="https://alidigitalsolution.in"
NEXTAUTH_SECRET="your-nextauth-secret"
```

**Important:**
- Replace `your-client-id-here` with your actual Client ID
- Replace `your-client-secret-here` with your actual Client Secret
- For production, set `NEXTAUTH_URL` to your production domain
- Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### 3. Restart Your Server

After adding the environment variables:
```bash
# Stop your dev server (Ctrl+C)
# Then restart it
npm run dev
```

### 4. For Production (Vercel)

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add:
   - `GOOGLE_CLIENT_ID` = your client ID
   - `GOOGLE_CLIENT_SECRET` = your client secret
   - `NEXTAUTH_URL` = `https://alidigitalsolution.in`
   - `NEXTAUTH_SECRET` = your secret
3. Redeploy your application

## Verification

After setup, the Google sign-in button should:
- ✅ Appear on `/login` and `/register` pages
- ✅ Redirect to Google OAuth when clicked
- ✅ Redirect admins to `/admin` after sign-in
- ✅ Redirect regular users to `/dashboard` after sign-in

## Troubleshooting

### Error: "Google sign-in is not configured"
- **Cause**: Missing `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET`
- **Fix**: Add both to your `.env` file and restart server

### Error: "redirect_uri_mismatch"
- **Cause**: Redirect URI in Google Console doesn't match your app
- **Fix**: Add exact URL to Google Console:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://alidigitalsolution.in/api/auth/callback/google`

### Error: "Configuration"
- **Cause**: Invalid credentials or missing environment variables
- **Fix**: Verify credentials are correct and environment variables are loaded

### Button doesn't appear
- **Cause**: Provider not registered (credentials missing)
- **Fix**: Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

## Testing

1. Go to `/login`
2. Click "Sign in with Google"
3. You should be redirected to Google's sign-in page
4. After authorizing, you'll be redirected back
5. Admins go to `/admin`, regular users go to `/dashboard`

## Security Notes

- Never commit `.env` files to git
- Keep `GOOGLE_CLIENT_SECRET` secure
- Use different OAuth clients for development and production
- Regularly rotate secrets
