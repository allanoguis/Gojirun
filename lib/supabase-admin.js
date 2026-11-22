import { createClient } from '@supabase/supabase-js';
import * as envModule from './env.js';

let supabaseAdmin;

function getSupabaseAdmin() {
    if (supabaseAdmin) return supabaseAdmin;

    const supabaseUrl = envModule.getSupabaseUrl();
    const serviceRoleKey = envModule.getSupabaseServiceRoleKey();

    if (!supabaseUrl) {
        throw new Error('Missing Supabase URL: set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
    }
    if (!serviceRoleKey) {
        throw new Error('Missing Supabase service role key: set SUPABASE_SERVICE_ROLE_KEY');
    }

    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    return supabaseAdmin;
}

const lazySupabaseAdmin = new Proxy({}, {
    get(_target, property) {
        return getSupabaseAdmin()[property];
    }
});

export default lazySupabaseAdmin;
