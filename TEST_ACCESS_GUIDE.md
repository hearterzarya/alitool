# Test Access Guide

This guide explains how to grant test access to users so they can test tools without payment.

## What is Test Access?

Test users can:
- ✅ Access all tools without payment
- ✅ Bypass subscription checks
- ✅ See all tools in their dashboard
- ✅ Use tools just like paid subscribers

## Quick Start

### Grant Test Access to a User

**Option 1: Using the script (Recommended)**
```bash
npm run grant-test-access <email>
```

Example:
```bash
npm run grant-test-access test@example.com
```

If the user doesn't exist, it will be created automatically with:
- Email: The email you provided
- Password: `test123`
- Role: `TEST_USER`

**Option 2: Using the API (For admins)**
```bash
POST /api/admin/grant-test-access
{
  "email": "test@example.com"
}
```

### Revoke Test Access

```bash
npm run revoke-test-access <email>
```

Example:
```bash
npm run revoke-test-access test@example.com
```

## How It Works

1. **User Role**: Users with `TEST_USER` role can bypass all payment/subscription checks
2. **Dashboard**: Test users see all active tools in their dashboard (not just subscriptions)
3. **Tool Access**: When accessing tools, the system checks the user role instead of subscriptions
4. **Visual Indicator**: Test users see a "🧪 Test Mode" badge in their dashboard

## For Developers

### Code Changes

1. **Schema**: Added `TEST_USER` to the `Role` enum
2. **Cookies API**: Updated to bypass subscription check for test users
3. **Dashboard**: Shows all tools for test users instead of just subscriptions
4. **Access Control**: Test users and admins can access tools without active subscriptions

### Testing

1. Create a test user:
   ```bash
   npm run grant-test-access test@example.com
   ```

2. Login with the test user:
   - Email: `test@example.com`
   - Password: `test123`

3. Navigate to dashboard - you should see all tools available

4. Try accessing a tool - it should work without payment

5. Revoke access when done:
   ```bash
   npm run revoke-test-access test@example.com
   ```

## Important Notes

⚠️ **Security**: Test access bypasses all payment checks. Only grant this to trusted testers.

⚠️ **Production**: Consider removing or restricting test access in production environments.

⚠️ **Prisma Client**: After schema changes, you may need to restart your dev server to regenerate Prisma Client types.

## Troubleshooting

### "Role not found" error
- Restart your dev server to regenerate Prisma Client
- Run: `npm run db:push:force` to sync schema

### Test user can't access tools
- Verify the user role is `TEST_USER` in the database
- Check that tools have cookies configured
- Ensure the user is logged in

### Script fails
- Check your `.env` file has `DATABASE_URL` set
- Ensure database is accessible
- Verify Prisma schema is up to date

