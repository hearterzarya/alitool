# Database Migration Required

## Issue
The Prisma schema has been updated to use `BigInt` for price fields, but the database still has `INTEGER` columns. This causes a type mismatch error.

## Solution
You need to update the database schema to match the Prisma schema.

### Steps:

1. **Stop your development server** (if running)

2. **Run the migration:**
   ```bash
   npx prisma db push
   ```

   This will:
   - Change all price columns from `INTEGER` to `BIGINT`
   - Add the new duration-specific price columns
   - Preserve all existing data

3. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Restart your development server**

### What will be changed:
- `priceMonthly`: INT → BIGINT
- `sharedPlanPrice`: INT → BIGINT  
- `privatePlanPrice`: INT → BIGINT
- `sharedPlanPrice1Month`: New column (BIGINT)
- `sharedPlanPrice3Months`: New column (BIGINT)
- `sharedPlanPrice6Months`: New column (BIGINT)
- `sharedPlanPrice1Year`: New column (BIGINT)
- `privatePlanPrice1Month`: New column (BIGINT)
- `privatePlanPrice3Months`: New column (BIGINT)
- `privatePlanPrice6Months`: New column (BIGINT)
- `privatePlanPrice1Year`: New column (BIGINT)

### Note:
All existing price data will be preserved during the migration.
