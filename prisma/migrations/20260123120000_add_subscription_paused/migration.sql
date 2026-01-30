-- Add PAUSED to SubscriptionStatus enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'SubscriptionStatus' AND e.enumlabel = 'PAUSED'
  ) THEN
    ALTER TYPE "SubscriptionStatus" ADD VALUE 'PAUSED';
  END IF;
END
$$;

-- Add pausedAt column to tool_subscriptions (PG 9.5+)
ALTER TABLE "tool_subscriptions" ADD COLUMN IF NOT EXISTS "pausedAt" TIMESTAMP(3);
