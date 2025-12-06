require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('Checking credentials...');
    if (!url) console.error('Error: NEXT_PUBLIC_SUPABASE_URL is missing');
    if (!key) console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');

    if (!url || !key) {
        return;
    }

    console.log('Testing connection to:', url);

    try {
        const supabase = createClient(url, key);
        // Simple health check call - auth.getSession is lightweight and doesn't require tables
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('FAIL: Error fetching session:', error.message);
            console.error('Full error:', error);
        } else {
            console.log('SUCCESS: Successfully connected and fetched session data.');
            // console.log('Session data:', data); // Sensitive? Usually just null or session object.
        }
    } catch (e) {
        console.error('CRITICAL FAIL: Exception during connection test:', e);
    }
}

testConnection();
