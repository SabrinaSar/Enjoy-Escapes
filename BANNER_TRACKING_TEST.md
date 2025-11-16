# ✅ Banner Tracking Test Checklist

## Changes Made

### 1. Fixed `sendBeacon` Content-Type Issue
- Now using `Blob` to ensure proper JSON content type
- This was likely preventing the API from parsing requests

### 2. Added Comprehensive Debug Logging
Now when you click a banner "Book Now" button, you should see:

**Browser Console (F12 → Console tab):**
```
🎨 Banner component render: { id: 1, id_type: 'number', title: '...', link: '...' }
🖱️ Banner button clicked! Event: { itemId: 1, itemType: 'banner', href: '...' }
🎯 Banner click tracking: { itemId: 1, itemType: 'banner', trackingData: {...} }
✅ sendBeacon sent successfully for banner
```

**Server Logs (if running locally with `npm run dev`):**
```
🎯 API received banner click: { escape_id: 1, item_type: 'banner', ... }
✅ Banner click tracked successfully: { escape_id: 1, item_type: 'banner' }
```

### 3. Visual Indicator for Banners Without Links
- Banners without links now show: ⚠️ No link configured
- This helps identify which banners won't track clicks

## How to Test

### Step 1: Deploy the Changes
```bash
git add .
git commit -m "Fix banner click tracking with Blob and debug logging"
git push
```

### Step 2: Open Your Website
1. Open in Chrome/Firefox
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Keep it open

### Step 3: Click "Book Now" on a Banner
1. Find a banner on your site
2. Make sure it has a "Book Now" button (if not, it has no link configured)
3. Click the "Book Now" button
4. Watch the console logs

### Step 4: What You Should See

#### ✅ SUCCESS - All these logs appear:
```
🎨 Banner component render: {...}
🖱️ Banner button clicked! Event: {...}
🎯 Banner click tracking: {...}
✅ sendBeacon sent successfully for banner
```
**→ Click is being tracked! Check database to confirm**

#### ⚠️ PARTIAL - Only see some logs:

**See `🎨` but not `🖱️`:**
- Button click not registering
- Check if button is actually clickable
- Try clicking directly on the text "Book now"

**See `🖱️` but not `🎯`:**
- trackClick function not being called
- This would be a code issue

**See `🎯` but not `✅`:**
- sendBeacon might be blocked
- Check Network tab for `/api/track-click` request
- Check for ad blockers

#### ❌ FAILURE - See error logs:
```
❌ Validation failed: {...}
```
- Check what the error message says
- Usually means banner ID is wrong type or missing

### Step 5: Check Network Tab
1. In DevTools, go to **Network** tab
2. Click "Book Now" again
3. Look for `/api/track-click` request
4. Click it and check:
   - **Status:** Should be 200
   - **Payload:** Should show JSON with `escape_id`, `item_type: "banner"`
   - **Response:** Should show `{ success: true }`

### Step 6: Verify in Database
Run in Supabase SQL Editor:
```sql
-- Check last 10 clicks
SELECT 
  id,
  escape_id,
  item_type,
  source,
  created_at
FROM public.clicks_data 
ORDER BY created_at DESC 
LIMIT 10;
```

You should see new rows with `item_type = 'banner'` and `escape_id` = your banner ID.

## Quick Database Test (Manual)

If you want to verify the API works without clicking, run this in browser console:

```javascript
fetch("/api/track-click", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    escape_id: 1,  // Replace with actual banner ID from your database
    item_type: "banner",
    source: "/",
    user_agent: navigator.userAgent,
    referrer: "",
  }),
})
.then(r => r.json())
.then(console.log);
```

Expected response: `{ success: true }`

## Common Issues

### No "Book Now" button visible
- Banner doesn't have a link configured in database
- Add a link to the banner in admin panel

### Ad blocker blocking requests
- Try in Incognito mode
- Try different browser
- Disable ad blocker temporarily

### Database migration not run
- Run `db/migration_add_item_type_tracking.sql` in Supabase
- Verify with: `SELECT * FROM information_schema.columns WHERE table_name = 'clicks_data' AND column_name = 'item_type';`

## Report Back

After testing, let me know:
1. ✅ Which console logs you DO see
2. ❌ Which console logs you DON'T see
3. 📊 Network tab status code
4. 🗄️ Any database errors in server logs

This will help pinpoint the exact issue!

