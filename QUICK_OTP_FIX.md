# Quick Fix: Make OTP Emails Work Now

## Problem
OTP emails are not being sent because Resend is in testing mode.

## Solution (2 minutes)

The code now **automatically falls back to Gmail SMTP** when Resend fails. Just add your Gmail App Password:

### Step 1: Get Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. If prompted, enable 2-Step Verification first
3. Click "Select app" → Choose "Mail"
4. Click "Select device" → Choose "Other (Custom name)"
5. Type: `AliDigitalSolution`
6. Click "Generate"
7. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update .env.local
Open `.env.local` and replace this line:
```env
SMTP_PASS="your-gmail-app-password-here"
```
With your actual App Password:
```env
SMTP_PASS="abcd efgh ijkl mnop"
```
(You can keep or remove spaces - both work)

### Step 3: Restart Server
Stop your server (Ctrl+C) and restart:
```bash
npm run dev
```

## That's It! ✅

Now when you register:
1. System tries Resend first
2. If Resend fails → **Automatically uses Gmail SMTP**
3. OTP email arrives in inbox! 📧

## Test It
1. Register a new account
2. Check your email inbox
3. OTP should arrive within seconds

## Still Not Working?

Check the terminal - it will show:
- ✅ "Email sent via SMTP fallback" = Working!
- ❌ Error message = Check SMTP_PASS in .env.local

For detailed troubleshooting, see `GMAIL_SMTP_SETUP.md`
