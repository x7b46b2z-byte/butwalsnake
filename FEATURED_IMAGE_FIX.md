# Fix Featured Image Issue for BlogPost

## Current Issue
Featured images are not working because the `BlogPost` table in Supabase is missing the `image_url` column.

## What to Do

### Step 1: Go to Supabase SQL Editor
1. Log in to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar

### Step 2: Add the Missing Column
Copy and paste this SQL command into the SQL Editor:

```sql
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS image_url TEXT;
```

Then click "Run" to execute.

### Step 3: Verify the Column Was Added
After running the SQL, featured images will work immediately. You can verify by:

Running this script in your terminal:
```bash
node verify-blog-schema.mjs
```

It will show:
```
✅ Found image column: "image_url"
✨ BlogPost schema is ready for featured images!
```

## Testing

After adding the column:

1. Go to Admin → Blog & Content
2. Click Edit on any blog post
3. Add a Featured Image URL (e.g., `https://play-lh.googleusercontent.com/...`)
4. Click "Save Changes"
5. The image URL will now save successfully and display in the public blog page

## How It Works Now

- When you enter a Featured Image URL in the admin panel, it saves to the `image_url` column
- When blog posts are displayed (admin list, public blog, detail page), the image loads and shows
- If the column is missing, you'll see a helpful message with the exact SQL needed

## Files Modified

- `src/app/api/blog/route.ts` - Simplified image column handling
- `src/app/api/blog/[id]/route.ts` - Updated PATCH endpoint  
- `src/app/blog/[slug]/page.tsx` - Cleaned up image normalization
- `src/app/admin/blog/page.tsx` - Shows SQL instructions in error message

## Migration Scripts

- `verify-blog-schema.mjs` - Check if image_url column exists
- `migrate-add-image-url.mjs` - Attempt to add column (requires direct SQL access)
