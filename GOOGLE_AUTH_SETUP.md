# Google Sign-in & Subscription Validation Setup Guide

## Overview

This guide explains how to set up Google Sign-in authentication and subscription validation for AliDigitalSolution.

## Features Implemented

### 1. Google Sign-in (NextAuth)
- ✅ Integrated with NextAuth.js
- ✅ Server-side authentication
- ✅ Automatic user creation/update
- ✅ Email verification auto-completed for Google accounts
- ✅ Google Sign-in button on login and register pages

### 2. Subscription Validation
- ✅ Automatic expiry checking
- ✅ Status badges (Active, Expiring Soon, Expired, Pending, Suspended)
- ✅ Days remaining display
- ✅ Warning when expiring in 3 days or less
- ✅ Blocked access for expired subscriptions
- ✅ Dashboard shows subscription status

### 3. Client-Side Firebase Option
- ✅ Firebase Authentication client-side integration
- ✅ Popup-based sign-in
- ✅ localStorage storage
- ✅ Backend sync API

## Setup Instructions

### Step 1: Google OAuth Setup (NextAuth - Recommended)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://alidigitalsolution.in/api/auth/callback/google` (production)

4. **Copy Credentials**
   - Copy the Client ID and Client Secret

5. **Add to Environment Variables**
   ```env
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### Step 2: Firebase Setup (Optional - Client-Side)

If you prefer client-side Firebase authentication:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Create a new project or select existing

2. **Enable Google Authentication**
   - Go to "Authentication" > "Sign-in method"
   - Enable "Google" provider
   - Add authorized domains

3. **Get Firebase Config**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (`</>`)
   - Copy the config object

4. **Add to Environment Variables**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
   ```

### Step 3: Set Up Subscription Validation Cron Job

The subscription validation endpoint is at `/api/subscriptions/validate`.

**Option A: Vercel Cron Jobs (Recommended)**

1. Create `vercel.json` in project root (if not exists):
```json
{
  "crons": [{
    "path": "/api/subscriptions/validate",
    "schedule": "0 0 * * *"
  }]
}
```

2. Add `CRON_SECRET` to Vercel environment variables:
   - Generate: `openssl rand -hex 32`
   - Add to Vercel dashboard > Settings > Environment Variables

3. Update the API route to use the secret:
   - The route already checks for `CRON_SECRET` in authorization header

**Option B: External Cron Service**

Use a service like:
- cron-job.org
- EasyCron
- GitHub Actions (scheduled workflows)

Configure to call:
```
POST https://alidigitalsolution.in/api/subscriptions/validate
Authorization: Bearer YOUR_CRON_SECRET
```

**Option C: Manual Trigger**

You can manually trigger validation by calling:
```bash
curl -X POST https://alidigitalsolution.in/api/subscriptions/validate \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Usage

### Google Sign-in (NextAuth)

Users can click "Sign in with Google" on:
- `/login` page
- `/register` page

The authentication flow:
1. User clicks Google button
2. Google OAuth popup opens
3. User selects Google account
4. NextAuth creates/updates user in database
5. User is redirected to dashboard

### Subscription Status Display

The dashboard automatically shows:
- **Active** (green badge): Subscription is active
- **Expiring Soon** (orange badge): 3 days or less remaining
- **Expired** (red badge): Subscription has expired
- **Pending** (yellow badge): Waiting for activation
- **Suspended** (red badge): Subscription suspended

### Subscription Validation

The system automatically:
- Checks expiry when accessing tools
- Shows warnings for expiring subscriptions
- Blocks access for expired subscriptions
- Updates status via cron job (daily)

## API Endpoints

### POST /api/subscriptions/validate
- Validates and updates expired subscriptions
- Requires `CRON_SECRET` in Authorization header
- Returns count of expired subscriptions

### GET /api/subscriptions/validate
- Returns user's subscription status
- Requires authentication
- Returns list of subscriptions with expiry info

## Testing

1. **Test Google Sign-in:**
   - Go to `/login`
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Verify user is created in database

2. **Test Subscription Status:**
   - Create a test subscription
   - Check dashboard for status badge
   - Verify days remaining display

3. **Test Expiry Blocking:**
   - Manually set subscription `currentPeriodEnd` to past date
   - Try to access tool
   - Verify access is blocked

## Troubleshooting

### Google Sign-in Not Working
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Verify redirect URI matches in Google Console
- Check browser console for errors

### Subscription Status Not Updating
- Verify cron job is running
- Check `CRON_SECRET` is correct
- Review server logs for errors

### Firebase Not Working
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Check Firebase project has Google auth enabled
- Ensure authorized domains are configured

## Security Notes

- Google OAuth credentials should be kept secret
- `CRON_SECRET` should be strong and unique
- Firebase config is public (safe for client-side)
- All authentication is server-side validated
