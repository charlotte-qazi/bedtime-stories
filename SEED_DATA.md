# Database Setup & Seed Data

## 1. Create the Stories Table

Go to your Supabase project SQL Editor and run:

```sql
-- Create enum type for reader
CREATE TYPE reader_type AS ENUM ('granny', 'grandpa');

-- Create stories table
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  reader reader_type NOT NULL,
  video_object_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all stories
CREATE POLICY "Allow authenticated users to read stories"
  ON stories
  FOR SELECT
  TO authenticated
  USING (true);

-- (Optional) Create policy to allow authenticated users to insert stories
-- Uncomment if you want users to create stories via the app later
-- CREATE POLICY "Allow authenticated users to insert stories"
--   ON stories
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (true);
```

## 2. Seed Test Data

Insert some sample stories for testing:

```sql
INSERT INTO stories (title, reader, video_object_key, created_at)
VALUES 
  ('The Magical Forest', 'granny', 'videos/magical-forest.mp4', NOW()),
  ('Adventures in Space', 'grandpa', 'videos/space-adventure.mp4', NOW() - INTERVAL '1 day'),
  ('The Brave Little Mouse', 'granny', 'videos/brave-mouse.mp4', NOW() - INTERVAL '2 days'),
  ('Pirate Treasure Hunt', 'grandpa', 'videos/pirate-treasure.mp4', NOW() - INTERVAL '3 days'),
  ('The Friendly Dragon', 'granny', 'videos/friendly-dragon.mp4', NOW() - INTERVAL '4 days');
```

## 3. Verify Data

Check that everything was created correctly:

```sql
-- View all stories
SELECT * FROM stories ORDER BY created_at DESC;

-- Check table structure
\d stories
```

## Notes

- The `video_object_key` field currently stores placeholder paths
- These will be replaced with actual S3/storage object keys when video upload is implemented
- RLS is enabled to ensure only authenticated users can access stories
- The table is ready for future features like user-specific stories (just add a `user_id` column and update policies)

## Future Enhancements

When ready to add more features:

1. **User-specific stories**: Add `user_id UUID REFERENCES auth.users(id)`
2. **Update RLS policies**: Filter stories by user
3. **Add insert policy**: Allow users to create their own stories
4. **Add metadata**: Story duration, status, etc.
