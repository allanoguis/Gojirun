const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wytweihpejtykixouubi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHdlaGlwZWp0eWtpeG91dWJpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ0Mjg2MSwiZXhwIjoyMDg3MDE4NDYxfQ.HIIpb2IS2g-kWHDJAvzhtceOQNsrEtqUSAM_4iMk0kM';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if users table exists
    const { data: usersTable, error: usersError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    console.log('Users table test:', { usersTable, usersError });
    
    // Test 2: Check if games table exists
    const { data: gamesTable, error: gamesError } = await supabaseAdmin
      .from('games')
      .select('count')
      .limit(1);
    
    console.log('Games table test:', { gamesTable, gamesError });
    
    // Test 3: Try to create Guest user
    const { data: guestUser, error: guestError } = await supabaseAdmin
      .from('users')
      .upsert({
        user_id: '000000',
        email: 'guest@example.com',
        fullname: 'Guest Player',
        profile_image_url: null,
        created_at: new Date(),
        last_sign_in_at: new Date()
      })
      .select()
      .single();
    
    console.log('Guest user creation test:', { guestUser, guestError });
    
  } catch (err) {
    console.error('Supabase test error:', err);
  }
}

testSupabase();
