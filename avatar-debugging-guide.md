# Avatar Display Debugging Guide

## Issue Description
Clerk-registered accounts are not showing their respective avatars in the leaderboard.

## Root Cause Analysis

### 1. Field Name Mapping
**Problem**: Database uses `profile_image_url` (snake_case) but API response needs `profileImageUrl` (camelCase)

**Fixed**: ✅ Updated `lib/api-services.js` line 147 to handle both field names:
```javascript
profileImageUrl: game.users?.profile_image_url || game.users?.profileImageUrl,
```

### 2. Data Flow Verification

#### Expected Flow:
1. **Clerk Authentication** → `user.imageUrl` (Clerk avatar URL)
2. **Game Engine** → `saveUser()` with `profileImageUrl` parameter
3. **Database** → `profile_image_url` field in `users` table
4. **API Service** → `getLeaderboard()` queries `profile_image_url`
5. **Component** → `player.profileImageUrl` displays avatar

#### Current Status:
- ✅ Clerk provides `user.imageUrl` in engine.jsx
- ✅ `saveUser()` correctly maps to `profile_image_url`
- ✅ Database query selects `profile_image_url`
- ✅ API response maps field correctly
- ✅ Component uses `player.profileImageUrl`

## Debugging Steps

### Step 1: Check Console Logs
Open browser console and look for:
- `"Avatar loaded successfully for player: [name] URL: [url]"`
- `"Avatar load error for player: [name] URL: [url]"`

### Step 2: Test with Real Clerk User
1. Sign in with a Clerk account that has an avatar
2. Play a game to save score
3. Check leaderboard for avatar display
4. Check console logs for avatar URL

### Step 3: Verify Database Data
Run this SQL query in Supabase:
```sql
SELECT user_id, fullname, email, profile_image_url 
FROM users 
WHERE user_id != '000000' 
ORDER BY created_at DESC;
```

### Step 4: Test API Response
Check the leaderboard API response:
```javascript
// In browser console
fetch('/api/leaderboard')
  .then(r => r.json())
  .then(data => console.log(data.leaderboard[0]));
```

### Step 5: Network Tab Inspection
1. Open browser DevTools → Network tab
2. Load leaderboard
3. Look for avatar image requests
4. Check response status and headers

## Common Issues & Solutions

### Issue 1: CORS Errors
**Problem**: Clerk avatar URLs blocked by CORS
**Solution**: Add Clerk domains to Next.js config or use proxy

### Issue 2: Invalid URLs
**Problem**: `user.imageUrl` is null or invalid
**Solution**: Check Clerk user profile setup

### Issue 3: Image Loading Failures
**Problem**: Network issues or 404 errors
**Solution**: Check console error logs and network tab

### Issue 4: Database Field Missing
**Problem**: `profile_image_url` field doesn't exist
**Solution**: Run database migration to add field

## Testing Checklist

- [ ] Clerk user has avatar set in profile
- [ ] `user.imageUrl` is not null in engine.jsx
- [ ] Database contains valid `profile_image_url` values
- [ ] API response includes `profileImageUrl` field
- [ ] Console shows successful avatar loading
- [ ] Network requests for avatars return 200 status

## Quick Fix Script

If you need to update existing users without avatars:
```sql
-- Update users with null profile_image_url to use DiceBear
UPDATE users 
SET profile_image_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || fullname
WHERE profile_image_url IS NULL AND user_id != '000000';
```

## Enhanced Error Handling

Added debugging logs to `player-stats.jsx`:
- `onLoad`: Logs successful avatar loading
- `onError`: Logs failed loading with URL details

## Next Steps

1. **Test with real Clerk authentication**
2. **Check console logs for avatar loading**
3. **Verify database contains proper URLs**
4. **Monitor network requests for avatar images**
5. **Test fallback to DiceBear avatars**

The avatar display should now work correctly for Clerk-registered accounts with proper error handling and debugging capabilities.
