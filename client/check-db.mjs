import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://wytweihpejtykixouubi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHdlaWhwZWp0eWtpeG91dWJpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ0Mjg2MSwiZXhwIjoyMDg3MDE4ODYxfQ.HIIpb2IS2g-kWHDJAvzhtceOQNsrEtqUSAM_4iMk0kM'
);

async function check() {
    const { count: userCount, error: userError } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: gameCount, error: gameError } = await supabase.from('games').select('*', { count: 'exact', head: true });

    console.log('User count:', userCount, userError || '');
    console.log('Game count:', gameCount, gameError || '');

    const { data: sample, error: sampleError } = await supabase.from('games').select('*, users(*)').limit(1);
    console.log('Sample game with user join:', JSON.stringify(sample, null, 2), sampleError || '');
}

check();
