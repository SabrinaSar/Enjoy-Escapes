# 🔍 Banner Click Tracking Debugging Guide

## Problem
Banner "Book Now" button clicks are not being tracked in the database.

## What Should Happen
When you click the "Book Now" button on a banner:
1. **Browser Console** should show:
   - `🎨 Banner component render:` - Shows banner ID and details when banner loads
   - `🎯 Banner click tracking:` - Shows tracking data being prepared
   - `✅ sendBeacon sent successfully for banner` - Confirms data was sent
   
2. **Server Logs** should show:
   - `🎯 API received banner click:` - API received the data
   - `✅ Banner click tracked successfully:` - Data was saved to database

3. **Database** should have a new row in `clicks_data` with:
   - `escape_id` = banner ID
   - `item_type` = 'banner'

## Debugging Steps

### Step 1: Check Browser Console
1. Open your website in a browser
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Click on a banner's "Book Now" button
5. Look for the logs mentioned above

**What to check:**
- ❓ Do you see `🎨 Banner component render:`?
  - **YES** → Banner component is loading correctly
  - **NO** → Banner component is not rendering (check if banner has a link)
  
- ❓ Do you see `🎯 Banner click tracking:`?
  - **YES** → Click handler is firing
  - **NO** → Click handler not firing (check TrackableLink component)
  
- ❓ Do you see `✅ sendBeacon sent successfully`?
  - **YES** → Data was sent to API
  - **NO** → Check network tab for errors

### Step 2: Check Network Tab
1. In Developer Tools, go to "Network" tab
2. Click "Book Now" button on a banner
3. Look for a request to `/api/track-click`

**What to check:**
- ❓ Do you see the request?
  - **YES** → API is being called
  - **NO** → sendBeacon might be blocked or failed
  
- ❓ What is the Status Code?
  - **200** → API received the request
  - **400** → Validation error (check request payload)
  - **500** → Server error

- ❓ Check the Request Payload (in the "Payload" tab):
  ```json
  {
    "escape_id": 123,  // Should be a NUMBER (banner ID)
    "item_type": "banner",  // Should be "banner"
    "source": "/",
    "user_agent": "...",
    "referrer": "...",
    "timestamp": "..."
  }
  ```

### Step 3: Check Server Logs
If you're running locally:
```bash
npm run dev
```

Look for:
- `🎯 API received banner click:` - API got the request
- `❌ Validation failed:` - Data validation error
- `❌ Error tracking click:` - Database insert error
- `✅ Banner click tracked successfully:` - Success!

### Step 4: Check Database
Run this SQL query in Supabase:
```sql
-- Check recent clicks
SELECT 
  id,
  escape_id,
  item_type,
  source,
  created_at
FROM public.clicks_data 
ORDER BY created_at DESC 
LIMIT 10;

-- Check banner clicks specifically
SELECT 
  escape_id as banner_id,
  COUNT(*) as click_count
FROM public.clicks_data 
WHERE item_type = 'banner'
GROUP BY escape_id;
```

## Common Issues & Solutions

### Issue 1: Banner ID is NULL or undefined
**Symptom:** Validation error in API logs
**Cause:** Banner data not loaded properly
**Fix:** Check banner data in `fetchBanners` action

### Issue 2: Content-Type header missing
**Symptom:** API can't parse request body
**Cause:** sendBeacon not using Blob
**Fix:** Already fixed - using Blob now

### Issue 3: item_type column doesn't exist
**Symptom:** Database error in server logs
**Cause:** Migration not run
**Fix:** Run `db/migration_add_item_type_tracking.sql`

### Issue 4: sendBeacon blocked
**Symptom:** No network request visible
**Cause:** Ad blocker or browser security
**Fix:** Test in incognito mode or different browser

### Issue 5: Banner doesn't have a link
**Symptom:** No "Book Now" button visible
**Cause:** Banner link is empty/null
**Fix:** Make sure banner has a link in the database

## Test Script

Open browser console and run this to test manually:

```javascript
// Test banner click tracking
const testBannerClick = async () => {
  const trackingData = {
    escape_id: 1, // Replace with actual banner ID
    item_type: "banner",
    source: window.location.pathname,
    user_agent: navigator.userAgent,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
  };

  console.log("Testing banner click with data:", trackingData);

  try {
    const response = await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackingData),
    });
    
    const result = await response.json();
    console.log("API Response:", result);
    
    if (result.success) {
      console.log("✅ Success! Check database for new row");
    } else {
      console.error("❌ Failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run the test
testBannerClick();
```

## Next Steps

1. Deploy the updated code with debug logging
2. Click "Book Now" on a banner
3. Check browser console for the logs
4. Check server logs if running locally
5. Report back what logs you see (or don't see)

This will help us pinpoint exactly where the tracking is failing!

