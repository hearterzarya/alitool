# Gmail SMTP Setup for OTP Emails

## Quick Setup (5 minutes)

The system now automatically falls back to Gmail SMTP when Resend is in testing mode. Follow these steps:

### Step 1: Enable 2-Step Verification
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter name: `AliDigitalSolution OTP`
5. Click **Generate**
6. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update .env.local
Open `.env.local` and update the SMTP_PASS:
```env
SMTP_PASS="abcd efgh ijkl mnop"
```
(Remove spaces or keep them - both work)

### Step 4: Restart Server
```bash
npm run dev
```

## How It Works

1. **Primary**: Tries to send via Resend
2. **Automatic Fallback**: If Resend fails (testing mode), automatically uses Gmail SMTP
3. **Development Fallback**: If both fail, logs OTP to console

## Testing

1. Register a new account
2. Check your email inbox for OTP
3. If email doesn't arrive, check terminal for OTP code

## Troubleshooting

### "Invalid login" error
- Make sure you're using **App Password**, not your regular Gmail password
- Verify 2-Step Verification is enabled

### "Connection timeout"
- Check your internet connection
- Gmail SMTP might be blocked by firewall - try different network

### Still not working?
- Check terminal logs for specific error messages
- Verify SMTP credentials are correct in `.env.local`
- Make sure you restarted the server after updating `.env.local`

## Security Note

- App Passwords are safer than regular passwords
- Never commit `.env.local` to git (it's already in .gitignore)
- Each App Password can be revoked individually
