# Database Connection Troubleshooting

## Error: Can't reach database server

If you're seeing this error, it means your application cannot connect to your Neon PostgreSQL database.

### Quick Fixes

1. **Check your `.env` file**
   ```bash
   # Make sure DATABASE_URL is set correctly
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   ```

2. **Verify Neon Database Status**
   - Log into your Neon dashboard
   - Check if your database is active and running
   - Verify the connection string matches your `.env` file

3. **Test Connection String**
   ```bash
   # Test the connection directly
   npx prisma db pull
   ```

4. **Check Network/Firewall**
   - Ensure your IP is not blocked
   - Neon databases are accessible from anywhere by default
   - Check if you're behind a VPN that might block connections

5. **Connection Pool Issues**
   - Neon uses connection pooling
   - Make sure you're using the `-pooler` endpoint if available
   - Some Neon pooler URLs work without `pgbouncer=true` (use the format Neon provides)
   - Keep `sslmode=require` and any required options like `channel_binding=require`

### Common Neon Connection String Formats

**Direct Connection:**
```
postgresql://user:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

**Pooled Connection (Recommended):**
```
postgresql://user:password@ep-xxx-xxx-pooler.us-east-1.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
```

### Steps to Fix

1. **Get Fresh Connection String from Neon**
   - Go to Neon Dashboard → Your Project → Connection Details
   - Copy the connection string
   - Update your `.env` file

2. **Regenerate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Test Database Connection**
   ```bash
   npx prisma db push
   ```

4. **Restart Your Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### If Problem Persists

1. **Check Neon Dashboard**
   - Verify database is not paused
   - Check for any service alerts
   - Verify billing/account status

2. **Check Environment Variables**
   ```bash
   # Make sure .env file is in the root directory
   # Check if DATABASE_URL is actually set
   echo $DATABASE_URL  # Linux/Mac
   # or check in your .env file directly
   ```

3. **Try Direct Connection Test**
   ```bash
   # Install psql if needed
   psql "your-connection-string-here"
   ```

4. **Contact Neon Support**
   - If database is active but connection fails
   - Check Neon status page for outages
   - Contact Neon support with your project details

### Prevention

- Always use pooled connections for production
- Set up connection retry logic in your application
- Monitor database connection health
- Use environment variables, never hardcode credentials
