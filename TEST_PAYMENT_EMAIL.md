# Testing Payment Confirmation Emails

## How to Test

### 1. Make a Test Payment
1. Go to `/tools` page
2. Click on any tool
3. Complete the checkout process
4. Make a payment (use test payment method)

### 2. Check Email Sending

#### Via Webhook (Automatic)
- When Paygic sends webhook with `txnStatus: 'SUCCESS'`
- Email is automatically sent via `/api/payments/webhook` route
- Check server logs for: `✓ Email sent to user@example.com: Order Confirmation - Tool Name`

#### Via Status Check (Manual)
- When user checks payment status via `/api/payments/status` route
- Email is sent if payment is successful
- This happens when user visits `/payment/success?ref=...` page

### 3. Verify Email Content

The email should include:
- ✅ Order number (merchantReferenceId)
- ✅ Tool/Bundle name
- ✅ Plan type (Shared/Private)
- ✅ Amount paid
- ✅ Payment date
- ✅ Subscription status (Active/Pending)
- ✅ Credentials (if subscription is active and credentials exist)
- ✅ Dashboard link

### 4. Check Server Logs

Look for these log messages:

**Success:**
```
✓ Email sent to user@example.com: Order Confirmation - Tool Name
```

**Development Mode (if email not configured):**
```
⚠️  RESEND_API_KEY not configured. Logging email to console instead.
============================================================
📧 EMAIL (Development Mode - Not Actually Sent)
============================================================
To: user@example.com
Subject: Order Confirmation - Tool Name
...
```

**Error:**
```
Failed to send order confirmation email: [error message]
```

### 5. Common Issues

#### Email Not Sending
1. **Check Resend API Key**: Verify `RESEND_API_KEY` in `.env` is correct
2. **Check Email Provider**: Ensure `EMAIL_PROVIDER="resend"` is set
3. **Check Payment Status**: Email only sends for `status === 'SUCCESS'`
4. **Check Server Logs**: Look for error messages

#### Email Sending but Not Received
1. **Check Spam Folder**: Emails might be filtered
2. **Check Resend Dashboard**: Verify email was sent successfully
3. **Check Email Address**: Ensure user email is correct in database

#### Credentials Not Showing
- Credentials only show if:
  - Subscription `activationStatus === 'ACTIVE'`
  - Credentials exist and are not placeholders
  - Plan type matches (SHARED shows sharedCredentials, PRIVATE shows privateCredentials)

### 6. Manual Test

You can manually trigger email sending by calling the function:

```typescript
import { sendOrderConfirmationEmail } from '@/lib/order-email';

// In an API route or server action
await sendOrderConfirmationEmail('payment-id-here');
```

### 7. Email Templates

- **Tool Purchase**: Uses `generateOrderConfirmationEmailHtml()`
- **Bundle Purchase**: Uses `generateBundleOrderConfirmationEmailHtml()`

Both templates are responsive and include:
- Professional design with gradient header
- Order details in organized sections
- Status badges (Active/Pending)
- Credentials display (if available)
- Dashboard link button
- Support contact information

## Production Checklist

- [ ] Resend API key is configured
- [ ] Email provider is set to "resend"
- [ ] `EMAIL_FROM` uses verified domain
- [ ] Test payment sends email successfully
- [ ] Email content is correct
- [ ] Credentials display correctly (if applicable)
- [ ] Dashboard link works
- [ ] Email is received (not in spam)
