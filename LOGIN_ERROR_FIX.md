# Login Callback Error Fix

## Error: `?error=Callback`

This error occurs when NextAuth's OAuth callback handler fails. I've implemented fixes to handle this better.

## Fixes Applied

### 1. ✅ Improved Error Handling in Login Page
- Added error detection from URL query parameters
- Shows user-friendly error messages
- Handles different OAuth error types

### 2. ✅ Simplified signIn Callback
- Made the callback non-blocking
- Errors in the callback won't prevent sign-in
- PrismaAdapter handles user/account creation

### 3. ✅ Database Tables Verified
- Ran `prisma db push` to ensure all tables exist
- NextAuth tables (accounts, sessions, verification_tokens) are created

### 4. ✅ Enabled Debug Logging
- Added `debug: true` in development mode
- Better error visibility in server logs

## Common Causes of "Callback" Error

1. **Database Connection Issues**
   - Check if database is accessible
   - Verify `DATABASE_URL` in `.env`

2. **Missing Database Tables**
   - Run: `npx prisma db push`
   - Verify tables exist: `accounts`, `sessions`, `verification_tokens`

3. **PrismaAdapter Issues**
   - The adapter might fail to create Account record
   - Check server logs for Prisma errors

4. **Google OAuth Configuration**
   - Verify redirect URI matches exactly
   - Check if credentials are correct

## Troubleshooting Steps

### Step 1: Check Server Logs
Look for errors in your terminal/console when clicking "Sign in with Google":
```
Error in Google signIn callback: ...
Prisma error code: ...
```

### Step 2: Verify Database Tables
Run the diagnostic script:
```bash
tsx scripts/check-nextauth-tables.ts
```

### Step 3: Test Database Connection
```bash
npx prisma studio
```
This will open Prisma Studio - if it works, database is connected.

### Step 4: Check Google Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Verify your OAuth Client ID is active
3. Check Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://alidigitalsolution.in/api/auth/callback/google` (prod)

### Step 5: Verify Environment Variables
Make sure these are set in `.env`:
```env
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"  # or https://alidigitalsolution.in for prod
NEXTAUTH_SECRET="your-secret"
DATABASE_URL="your-database-url"
```

## What to Check in Server Logs

When the error occurs, check for:
1. **Prisma errors**: Look for `P1001`, `P2002`, etc.
2. **Database connection errors**: "Can't reach database server"
3. **OAuth errors**: "Invalid client", "redirect_uri_mismatch"
4. **Adapter errors**: "Failed to create account"

## Next Steps

1. **Restart your dev server** after the fixes
2. **Try Google sign-in again**
3. **Check the browser console** for any client-side errors
4. **Check server logs** for detailed error messages
5. **Share the error logs** if the issue persists

## If Error Persists

The error message on the login page will now be more helpful. Common fixes:

- **"OAuth callback failed"**: Usually database or adapter issue
- **"Configuration"**: Google OAuth credentials missing/wrong
- **"OAuthAccountNotLinked"**: Email already exists with password

Check server logs for the exact error and we can fix it accordingly.
