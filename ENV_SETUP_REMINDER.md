# ⚠️ IMPORTANT: Add Google OAuth Credentials to Your .env File

## Your Google OAuth Credentials

Add these to your `.env` or `.env.local` file:

```env
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="https://alidigitalsolution.in"
```

## Steps

1. **Open your `.env` or `.env.local` file** (create it if it doesn't exist in the project root)

2. **Add the credentials above**

3. **Make sure NEXTAUTH_URL is set:**
   - Development: `NEXTAUTH_URL="http://localhost:3000"`
   - Production: `NEXTAUTH_URL="https://alidigitalsolution.in"`

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

5. **For Production (Vercel):**
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add all three variables above
   - Redeploy your application

## Verify Google Console Setup

Make sure you've added these **Authorized redirect URIs** in Google Cloud Console:

- `http://localhost:3000/api/auth/callback/google` (development)
- `https://alidigitalsolution.in/api/auth/callback/google` (production)

## Test

After adding credentials and restarting:
1. Go to `/login`
2. Click "Sign in with Google"
3. You should be redirected to Google's sign-in page
4. After authorizing, you'll be redirected back to your app
