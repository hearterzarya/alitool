# Email Setup Guide

This guide explains how to configure email sending for OTP verification and password reset functionality.

## Email Providers

The application supports two email providers:

1. **Resend** (Recommended) - Best for Vercel deployments
2. **SMTP** - For custom email servers

## Option 1: Resend (Recommended)

Resend is the recommended provider for production, especially on Vercel.

### Setup Steps:

1. **Create Resend Account**
   - Go to [https://resend.com](https://resend.com)
   - Sign up for a free account
   - Verify your domain (or use their test domain for development)

2. **Get API Key**
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Configure Environment Variables**
   ```env
   EMAIL_PROVIDER="resend"
   RESEND_API_KEY="re_your_api_key_here"
   EMAIL_FROM="noreply@alidigitalsolution.in"
   EMAIL_FROM_NAME="AliDigitalSolution"
   ```

4. **Domain Verification** (Production)
   - Add DNS records as instructed by Resend
   - Verify your domain
   - Update `EMAIL_FROM` to use your verified domain

### Resend Free Tier:
- 3,000 emails/month
- 100 emails/day
- Perfect for most applications

## Option 2: SMTP

Use SMTP if you have your own email server or prefer a different provider.

### Setup Steps:

1. **Get SMTP Credentials**
   - Gmail: Use App Password (not regular password)
   - Outlook/Hotmail: Use App Password
   - Custom SMTP: Get from your email provider

2. **Configure Environment Variables**
   ```env
   EMAIL_PROVIDER="smtp"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   EMAIL_FROM="noreply@alidigitalsolution.in"
   EMAIL_FROM_NAME="AliDigitalSolution"
   ```

### Gmail Setup:
1. Enable 2-Step Verification
2. Generate App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use the 16-character app password (not your regular password)

### Common SMTP Settings:

**Gmail:**
- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)

**Outlook:**
- Host: `smtp-mail.outlook.com`
- Port: `587`

**Custom:**
- Check with your email provider

## Testing Email Configuration

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Test Registration:**
   - Go to `/register`
   - Create a test account
   - Check your email for OTP code

3. **Check Server Logs:**
   - In development, email sending is logged to console
   - Look for: `✓ Email sent to email@example.com: Your AliDigitalSolution verification code`

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure no extra spaces or quotes

2. **Resend Issues:**
   - Verify API key is correct
   - Check Resend dashboard for errors
   - Ensure domain is verified (for production)

3. **SMTP Issues:**
   - Verify SMTP credentials
   - Check firewall/network restrictions
   - Try different port (587 vs 465)
   - For Gmail, ensure App Password is used (not regular password)

4. **Check Application Logs:**
   - Look for email sending errors in console
   - Check Vercel function logs (if deployed)

### Rate Limiting

The application includes rate limiting to prevent abuse:
- **OTP Requests:** 3 per email per minute
- **Password Reset:** 3 per email per hour
- **IP-based limits:** Additional protection

If you hit rate limits during testing, wait for the cooldown period.

## Production Checklist

- [ ] Email provider configured (Resend or SMTP)
- [ ] Domain verified (for Resend)
- [ ] `EMAIL_FROM` uses verified domain
- [ ] All environment variables set in Vercel/dashboard
- [ ] Test email sending works
- [ ] OTP emails are received
- [ ] Password reset emails are received
- [ ] Email templates look correct

## Support

If you continue to have issues:
1. Check application logs
2. Verify environment variables
3. Test with a different email provider
4. Contact support with error messages
