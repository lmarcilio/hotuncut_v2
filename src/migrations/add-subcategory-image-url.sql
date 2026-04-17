-- Migration to add image_url to subcategories
-- This should be run in the SQL Editor of Supabase

-- Check if column exists and add it if not
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'subcategories' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE subcategories ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Column image_url added to subcategories';
    ELSE
        RAISE NOTICE 'Column image_url already exists in subcategories';
    END IF;
END $$;

-- Optional: Add a unique constraint or other validations if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'subcategories' 
        AND constraint_name = 'subcategories_image_url_not_empty'
    ) THEN
        -- Add a check constraint to ensure URL format
        ALTER TABLE subcategories 
        ADD CONSTRAINT subcategories_image_url_format 
        CHECK (image_url IS NULL OR image_url ~* '^https?://');
        RAISE NOTICE 'Added URL format constraint to subcategories.image_url';
    END IF;
END $$;