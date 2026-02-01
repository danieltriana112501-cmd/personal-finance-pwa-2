import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Create a supabase client on the browser with project's credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
            // During build/SSR if envs are missing, we can return a dummy client or null to avoid crash
            // But createBrowserClient might need valid URL structure. 
            // Let's return a client with dummy values to allow build to pass static generation
            return createBrowserClient(
                'https://placeholder.supabase.co',
                'placeholder-key'
            )
        }
        // If missing in browser, warn and return dummy to prevent crash
        console.warn('⚠️ Supabase environment variables are missing! Check your Netlify configuration.');
        return createBrowserClient(
            'https://placeholder.supabase.co',
            'placeholder-key'
        )
    }

    return createBrowserClient(supabaseUrl, supabaseKey)
}
