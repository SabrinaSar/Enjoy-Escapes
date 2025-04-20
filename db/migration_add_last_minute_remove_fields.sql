-- Migration to remove subtitle, country, city, validTo fields and add last_minute field
-- This migration aligns with the frontend changes to update the schema structure

-- First, add the new last_minute column
ALTER TABLE "public"."escapes_data" ADD COLUMN "last_minute" BOOLEAN DEFAULT false;

-- Update existing data to ensure last_minute field has appropriate values
-- We'll set last_minute to true for any escapes that were previously showing as last-minute 
-- based on their validTo date (those expiring within 48 hours)
UPDATE "public"."escapes_data" 
SET "last_minute" = true 
WHERE "validTo" IS NOT NULL 
AND "validTo" < (NOW() + INTERVAL '48 hours');

-- Now remove the fields that are no longer needed
ALTER TABLE "public"."escapes_data" DROP COLUMN "subtitle";
ALTER TABLE "public"."escapes_data" DROP COLUMN "country";
ALTER TABLE "public"."escapes_data" DROP COLUMN "city";
ALTER TABLE "public"."escapes_data" DROP COLUMN "validTo";

-- Add a comment to explain the purpose of this field
COMMENT ON COLUMN "public"."escapes_data"."last_minute" IS 'Flag to mark last-minute deals replacing the previous validTo date-based filtering'; 