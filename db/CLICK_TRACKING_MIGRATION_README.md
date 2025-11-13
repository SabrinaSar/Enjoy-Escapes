# Click Tracking Migration Guide

## Overview
This migration adds support for tracking clicks on both **escape deals** and **promotional banners**, and removes the previous limitation that only allowed escape tracking.

## What's Changed

### 1. Database Schema Updates
- Added `item_type` column to `clicks_data` table to distinguish between 'escape' and 'banner' clicks
- Removed strict foreign key constraint that required all clicks to be valid escapes
- Added new database functions for efficient click count queries:
  - `get_click_counts_by_escape()` - Returns click counts for all escape deals
  - `get_click_counts_by_banner()` - Returns click counts for all promotional banners

### 2. API Route Updates
- `/api/track-click` now validates and stores the `item_type` field
- Supports both 'escape' and 'banner' item types
- Added validation to ensure only valid item types are accepted

### 3. Analytics Page Improvements
- **Banner Performance Section**: New dedicated section showing all banner clicks
- **Escape Deal Performance**: Now shows ALL escape deals with clicks (not limited to top 20)
- **Enhanced Recent Activity**: Shows both escapes and banners with type badges
- **Click Discrepancy Explanation**: Added informative notice explaining why internal analytics show higher numbers than affiliate networks

## Migration Steps

### Step 1: Apply Database Migration

Run the following SQL script in your Supabase SQL editor:

```sql
-- File: db/migration_add_item_type_tracking.sql
```

**To apply this migration:**

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `db/migration_add_item_type_tracking.sql`
4. Click "Run" to execute the migration

### Step 2: Verify Migration

After running the migration, verify that:

1. The `clicks_data` table now has an `item_type` column:
   ```sql
   SELECT column_name, data_type, column_default 
   FROM information_schema.columns 
   WHERE table_name = 'clicks_data';
   ```

2. The new functions exist:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_name IN ('get_click_counts_by_escape', 'get_click_counts_by_banner');
   ```

### Step 3: Deploy Code Changes

The following files have been updated and should be deployed:
- `app/api/track-click/route.ts` - Now handles both escape and banner tracking
- `app/admin/analytics/page.tsx` - Enhanced analytics with banner tracking and full data display
- `app/components/Banner.tsx` - Already configured to track banner clicks (no changes needed)

## Understanding Click Tracking

### How Clicks Are Tracked

1. **User Action**: When a user clicks on an escape deal or banner, the `TrackableLink` component fires
2. **Client-Side**: Uses `navigator.sendBeacon()` for reliable, non-blocking tracking
3. **API Call**: Sends data to `/api/track-click` with:
   - `escape_id` (or `banner_id`, stored in the same field)
   - `item_type` ('escape' or 'banner')
   - `source` (page path where click occurred)
   - `user_agent` (browser information)
   - `referrer` (previous page URL)
4. **Database**: Data stored in `clicks_data` table
5. **Analytics**: Admin can view all clicks in the Analytics dashboard

### What Counts as a Click?

Our analytics track **every single click** that occurs on your website, including:
- ✅ First-time visitors
- ✅ Returning visitors
- ✅ Mobile and desktop users
- ✅ Users with ad blockers
- ✅ Users with strict privacy settings
- ✅ Multiple clicks from the same user
- ✅ Clicks that may not result in a page load (network issues, etc.)

### Why Do Affiliate Networks Show Fewer Clicks?

**This is completely normal!** Affiliate networks (like Awin, CJ, etc.) filter clicks for various reasons:

#### Common Filtering Reasons:
1. **Ad Blockers** (20-30% of users)
   - Block affiliate tracking scripts
   - Prevent affiliate cookies from being set

2. **Privacy Settings** (10-20% of users)
   - Cookie blockers
   - Browser privacy modes (Incognito, Private Browsing)
   - Privacy-focused browsers (Brave, Firefox with Enhanced Tracking Protection)

3. **Technical Issues** (5-10%)
   - Network timeouts
   - Failed to reach affiliate servers
   - JavaScript disabled

4. **Fraud Prevention** (5-15%)
   - Suspicious patterns detected
   - Bot traffic filtered
   - VPN/proxy filtering
   - Datacenter IP addresses

5. **Deduplication** (Variable)
   - Multiple clicks from same user counted as one
   - Cookie-based session tracking
   - Time-based deduplication windows

#### Expected Discrepancy:
- **Normal Range**: Affiliate networks typically report **30-50% fewer** clicks than your internal analytics
- **Your Example**: 10,000 internal clicks → 3,000 affiliate clicks = **70% difference**
  - This is on the higher end but not unusual, especially if you have:
    - Tech-savvy audience (more likely to use ad blockers)
    - Mobile-heavy traffic (ad blockers more common on mobile)
    - International traffic (some countries have higher ad blocker usage)

#### Why Internal Analytics Are Higher:
Your internal tracking happens **before** the user leaves your site:
- ✅ Captured before redirect to affiliate
- ✅ Not blocked by ad blockers (it's your own domain)
- ✅ Works with all privacy settings
- ✅ Counts every single click attempt

Affiliate tracking happens **after** redirect:
- ❌ Can be blocked by ad blockers
- ❌ Requires cookies/JavaScript
- ❌ Subject to network issues
- ❌ Filtered for fraud

### Which Number Should You Use?

- **Internal Analytics (Your Dashboard)**: Use this to measure **user engagement** and **content performance**
- **Affiliate Network Reports**: Use this to measure **commission-eligible traffic** and **revenue potential**

Both numbers are correct—they just measure different things!

## Analytics Features

### Overview Statistics
- Total lifetime clicks across all items
- Number of unique items clicked (escapes + banners)
- Top performing escape deal
- Most recent click timestamp

### Banner Performance Section
- Complete list of all banners with clicks
- Sorted by click count (highest to lowest)
- Shows banner title, description, and total clicks
- Direct links to banner destinations

### Escape Deal Performance Section
- **Shows ALL escape deals** with clicks (no limit!)
- Sorted by click count (highest to lowest)
- Displays rank, title, type, price, and total clicks
- Direct links to deal pages
- Total count and click sum displayed

### Recent Activity
- Last 10 clicks across all item types
- Shows item name, type (badge), timestamp, source page, and referrer
- Color-coded badges: Blue for escapes, Purple for banners

## Testing the Migration

### Test Banner Tracking
1. Go to your homepage or any page with promotional banners
2. Click on a banner's "Book now" button
3. Check browser console for tracking confirmation (optional, silent by default)
4. Go to Admin → Analytics
5. Verify the banner appears in "Banner Performance" section
6. Check "Recent Activity" shows the banner click with a purple badge

### Test Escape Tracking
1. Go to your homepage or escapes page
2. Click on any escape deal card
3. Go to Admin → Analytics
4. Verify the escape appears in "Escape Deal Performance" section
5. Check "Recent Activity" shows the escape click with a blue badge

## Troubleshooting

### Issue: Banner clicks not appearing

**Possible causes:**
1. Database migration not applied
   - Solution: Run the migration SQL script
2. Old code still deployed
   - Solution: Deploy the updated files
3. Browser cache
   - Solution: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**To debug:**
```sql
-- Check if item_type column exists
SELECT * FROM clicks_data LIMIT 1;

-- Check for banner clicks
SELECT COUNT(*) FROM clicks_data WHERE item_type = 'banner';

-- Check recent clicks with types
SELECT id, escape_id, item_type, created_at 
FROM clicks_data 
ORDER BY created_at DESC 
LIMIT 10;
```

### Issue: "Function does not exist" error

**Solution:** The migration SQL wasn't fully applied. Run:
```sql
-- Create banner click count function
CREATE OR REPLACE FUNCTION public.get_click_counts_by_banner()
RETURNS TABLE (
  banner_id BIGINT,
  click_count BIGINT,
  item_type TEXT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    escape_id as banner_id,
    COUNT(*) as click_count,
    item_type
  FROM public.clicks_data 
  WHERE item_type = 'banner'
  GROUP BY escape_id, item_type
  ORDER BY click_count DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_click_counts_by_banner() TO authenticated;
```

### Issue: Analytics page shows error

**Solution:** Check Supabase logs for specific error. Common issues:
1. RLS policies blocking access
   - Ensure you're logged in as admin
2. Functions not created
   - Run the migration SQL
3. Missing item_type column
   - Run the migration SQL

## Rollback (If Needed)

If you need to rollback this migration:

```sql
-- Remove new functions
DROP FUNCTION IF EXISTS public.get_click_counts_by_banner();

-- Restore old function without item_type
CREATE OR REPLACE FUNCTION public.get_click_counts_by_escape()
RETURNS TABLE (
  escape_id BIGINT,
  click_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    escape_id,
    COUNT(*) as click_count
  FROM public.clicks_data 
  GROUP BY escape_id
  ORDER BY click_count DESC;
$$;

-- Remove item_type column (WARNING: This will lose item type data)
-- ALTER TABLE public.clicks_data DROP COLUMN IF EXISTS item_type;

-- Note: Don't drop item_type if you want to preserve historical data
-- Instead, just deploy the old code and ignore the column
```

## Future Enhancements

Potential improvements for the future:
- Date range filtering (show clicks for specific time periods)
- Click-through rate (CTR) calculations
- Conversion tracking (if integrated with affiliate networks)
- Export to CSV functionality
- Real-time click notifications
- Geographic data (if you add location tracking)
- Device type breakdown (desktop vs mobile)

## Questions or Issues?

If you encounter any problems with this migration, check:
1. Supabase logs for database errors
2. Browser console for JavaScript errors
3. Network tab for failed API calls
4. Database tables for correct schema

All tracking is designed to fail silently to never impact user experience—if something isn't tracking, users will never know!

