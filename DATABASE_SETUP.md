# Database Setup Guide

## Error: Table `public.tools` does not exist

If you're seeing this error, it means the database tables haven't been created yet. Follow these steps to fix it:

## Quick Fix

Run the database setup script:

```bash
npm run db:setup
```

This will:
1. Generate the Prisma Client
2. Create all required database tables
3. Seed the database with initial data

## Manual Setup

If the automated script doesn't work, you can run the steps manually:

### Step 1: Generate Prisma Client
```bash
npm run db:generate
```

### Step 2: Push Schema to Database
```bash
npm run db:push:force
```

**Note:** The `--accept-data-loss` flag is used because the database schema may have changed. If you have important data, back it up first.

### Step 3: Seed Database (Optional)
```bash
npm run db:seed
```

This will populate the database with sample tools and data.

## Troubleshooting

### Database Connection Issues

If you get connection errors:
1. Check your `.env` file has the correct `DATABASE_URL`
2. Ensure your database server is running and accessible
3. Verify network/firewall settings allow connections

### Permission Errors

If you see permission errors when generating Prisma Client:
- Stop your development server (`npm run dev`)
- Run `npm run db:generate` again
- Restart your development server

### Schema Conflicts

If you see warnings about data loss:
- Review the changes in `prisma/schema.prisma`
- Back up your database if you have important data
- Use `npm run db:push:force` to apply changes

## Verify Setup

After setup, you can verify everything is working:

1. Check Prisma Studio:
   ```bash
   npm run db:studio
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. Visit your application - the errors should be gone!

## Need Help?

If you continue to have issues:
1. Check the Prisma documentation: https://www.prisma.io/docs
2. Verify your database connection string format
3. Ensure all dependencies are installed: `npm install`

