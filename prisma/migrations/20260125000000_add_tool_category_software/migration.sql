-- Add SOFTWARE to ToolCategory enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'ToolCategory' AND e.enumlabel = 'SOFTWARE'
  ) THEN
    ALTER TYPE "ToolCategory" ADD VALUE 'SOFTWARE';
  END IF;
END
$$;
