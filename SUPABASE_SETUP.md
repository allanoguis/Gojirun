# Supabase Real-time Leaderboard Setup

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## Setup Instructions

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key from the project settings

2. **Set up Database Table**
   ```sql
   CREATE TABLE leaderboard (
     id SERIAL PRIMARY KEY,
     player_id TEXT NOT NULL,
     player_name TEXT NOT NULL,
     score INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Enable Real-time**
   - In your Supabase dashboard, go to the `leaderboard` table
   - Click on "Settings" and enable "Real-time"

4. **Create Database Function for Broadcasting**
   ```sql
   CREATE OR REPLACE FUNCTION broadcast_leaderboard_change()
   RETURNS TRIGGER AS $$
   BEGIN
     PERFORM pg_notify(
       'topic:leaderboard',
       json_build_object(
         'event', TG_OP,
         'table', TG_TABLE_NAME,
         'new', row_to_json(NEW),
         'old', row_to_json(OLD)
       )::text
     );
     RETURN COALESCE(NEW, OLD);
   END;
   $$ LANGUAGE plpgsql;
   ```

5. **Create Triggers**
   ```sql
   -- Trigger for INSERT
   CREATE TRIGGER leaderboard_insert_trigger
     AFTER INSERT ON leaderboard
     FOR EACH ROW
     EXECUTE FUNCTION broadcast_leaderboard_change();

   -- Trigger for UPDATE
   CREATE TRIGGER leaderboard_update_trigger
     AFTER UPDATE ON leaderboard
     FOR EACH ROW
     EXECUTE FUNCTION broadcast_leaderboard_change();

   -- Trigger for DELETE
   CREATE TRIGGER leaderboard_delete_trigger
     AFTER DELETE ON leaderboard
     FOR EACH ROW
     EXECUTE FUNCTION broadcast_leaderboard_change();
   ```

## Features

- **Real-time Updates**: Leaderboard automatically updates when scores change
- **Live Indicator**: Shows "🟢 Live" badge when real-time connection is active
- **Automatic Cleanup**: Unsubscribes from real-time updates when component unmounts
- **Error Handling**: Gracefully handles connection failures

## Usage

The leaderboard component will automatically:
1. Connect to Supabase real-time when mounted
2. Listen for INSERT, UPDATE, and DELETE events
3. Refresh the leaderboard data when changes occur
4. Show a live indicator when connected
5. Clean up the subscription when unmounted
