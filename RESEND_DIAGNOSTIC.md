# Resend API Troubleshooting Guide

## Common Reasons Why Resend API Might Not Work

### 1. **Testing Mode Restriction** (Most Common)
Resend accounts in testing mode can **only send emails to verified email addresses**.

**Symptoms:**
- Error: `403 Forbidden` or "testing emails" error
- Emails work for some addresses but not others

**Solution:**
- Go to https://resend.com/domains
- Verify your domain (e.g., `alidigitalsolution.in`)
- Update `EMAIL_FROM` in `.env.local` to use your verified domain:
  ```
  EMAIL_FROM="noreply@alidigitalsolution.in"
  ```
- Or verify your email address in Resend dashboard

### 2. **Invalid or Expired API Key**
The API key might be invalid, expired, or incorrectly formatted.

**Check:**
- API key must start with `re_`
- Go to https://resend.com/api-keys
- Verify the key is active and not revoked
- Copy the full key (no spaces)

**Current API Key Format Check:**
```bash
# Should start with "re_"
RESEND_API_KEY="re_JkaJyvRD_4TbW1VHrcGe62FTS653tNk8R"
```

### 3. **Domain Not Verified**
If using a custom domain, it must be verified in Resend.

**Steps:**
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Add `alidigitalsolution.in`
4. Add the DNS records provided by Resend
5. Wait for verification (usually 5-10 minutes)
6. Update `.env.local`:
   ```
   EMAIL_FROM="noreply@alidigitalsolution.in"
   ```

### 4. **Rate Limits / Quota Exceeded**
Free tier has limits on number of emails per day.

**Check:**
- Go to https://resend.com/dashboard
- Check your usage and limits
- Free tier: 3,000 emails/month

### 5. **From Address Issues**
The `EMAIL_FROM` address must be:
- A verified domain (if using custom domain)
- Or `onboarding@resend.dev` (default, but limited in testing mode)

**Current Setting:**
```
EMAIL_FROM="onboarding@resend.dev"
```

### 6. **Environment Variables Not Loaded**
The server might not have picked up the `.env.local` changes.

**Solution:**
1. **Restart your development server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Verify variables are loaded:**
   - Check terminal logs when server starts
   - Look for `[EMAIL] Provider: resend` in logs

## How to Diagnose the Issue

### Step 1: Test Email Endpoint
Visit this URL while your server is running:
```
http://localhost:3000/api/test-email?email=your-email@example.com
```

**Check the response:**
- If it says "success", Resend is working
- If it shows an error, check the error message

### Step 2: Check Terminal Logs
When you try to send an email, look for these logs:

```
[EMAIL] Starting email send...
[EMAIL] Provider: resend
[EMAIL] To: user@example.com
[EMAIL] From: onboarding@resend.dev
📤 Sending email via Resend to user@example.com...
```

**Error patterns:**
- `403 Forbidden` → Testing mode restriction
- `Invalid API key` → API key issue
- `domain not verified` → Domain verification needed
- `rate limit` → Quota exceeded

### Step 3: Check Resend Dashboard
1. Go to https://resend.com/dashboard
2. Check "API Keys" section - verify key is active
3. Check "Domains" section - verify domain is verified
4. Check "Logs" section - see if emails are being sent/rejected

### Step 4: Verify API Key
Test your API key directly:

```bash
curl -X POST 'https://api.resend.com/emails' \
  -H "Authorization: Bearer re_JkaJyvRD_4TbW1VHrcGe62FTS653tNk8R" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

## Quick Fixes

### Fix 1: Use Verified Email Address
If Resend is in testing mode, send to a verified email:
1. Go to https://resend.com/emails
2. Check which emails are verified
3. Test with that email address

### Fix 2: Enable SMTP Fallback
The code already has automatic SMTP fallback. If Resend fails, it will use Gmail SMTP automatically.

### Fix 3: Verify Domain (Recommended for Production)
1. Go to https://resend.com/domains
2. Add `alidigitalsolution.in`
3. Add DNS records
4. Wait for verification
5. Update `.env.local`:
   ```
   EMAIL_FROM="noreply@alidigitalsolution.in"
   ```

## Current Configuration

```env
EMAIL_PROVIDER="resend"
EMAIL_FROM="onboarding@resend.dev"
RESEND_API_KEY="re_JkaJyvRD_4TbW1VHrcGe62FTS653tNk8R"
```

## Next Steps

1. **Check terminal logs** when sending email
2. **Test with `/api/test-email` endpoint**
3. **Check Resend dashboard** for account status
4. **Verify domain** if you want to use custom domain
5. **Use SMTP fallback** if Resend continues to fail
