import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
        url: supabaseUrl ? 'Set' : 'Missing',
        key: supabaseAnonKey ? 'Set' : 'Missing'
    });
}

// Regular client with anon key (respects RLS)
export const supabase = createClient(
    supabaseUrl || 'https://yrvykwljzajfkraytbgr.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlydnlrd2xqemFqZmtyYXl0YmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MjczMjIsImV4cCI6MjA1MjUwMzMyMn0.WzWYdut9GkGSjH5cehOcuc6YzZR5g-XQgZ3Kh9d_6UA'
);

/**
 * Secure admin operations using server-side API
 * This replaces the direct supabaseAdmin client to avoid exposing service key
 */
export const supabaseAdmin = {
    from: (table) => ({
        select: async (columns = '*', options = {}) => {
            const response = await fetch('/api/admin/supabase-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getAuthToken()}`
                },
                body: JSON.stringify({
                    action: 'select',
                    table,
                    columns,
                    ...options
                })
            });
            return await response.json();
        },
        insert: async (data) => {
            const response = await fetch('/api/admin/supabase-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getAuthToken()}`
                },
                body: JSON.stringify({
                    action: 'insert',
                    table,
                    data
                })
            });
            return await response.json();
        },
        update: async (data) => ({
            eq: async (column, value) => {
                const response = await fetch('/api/admin/supabase-admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await getAuthToken()}`
                    },
                    body: JSON.stringify({
                        action: 'update',
                        table,
                        data,
                        id: value // Assuming 'id' column for now
                    })
                });
                return await response.json();
            }
        }),
        delete: () => ({
            eq: async (column, value) => {
                const response = await fetch('/api/admin/supabase-admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await getAuthToken()}`
                    },
                    body: JSON.stringify({
                        action: 'delete',
                        table,
                        id: value // Assuming 'id' column for now
                    })
                });
                return await response.json();
            }
        })
    })
};

// Helper function to get auth token
async function getAuthToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
}

// Auth helper functions
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
};

// User management functions
export const getUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    return { data, error };
};

export const updateUserProfile = async (userId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);
    return { data, error };
};

// First-time setup check
export const checkFirstTimeSetup = async () => {
    try {
        console.log('Checking users table...');
        // Use admin client if available to bypass RLS for this check
        const client = supabaseAdmin || supabase;
        const { count, error } = await client
            .from('users')
            .select('*', { count: 'exact', head: true });

        console.log('Users count result:', { count, error });

        if (error) {
            if (error.code === '42P01') { // Table doesn't exist
                console.log('Users table does not exist');
                return { isFirstTime: true, error: null };
            }
            return { isFirstTime: false, error };
        }

        return { 
            isFirstTime: count === 0 || count === null,
            error: null
        };
    } catch (error) {
        console.error('Error in checkFirstTimeSetup:', error);
        return { isFirstTime: false, error };
    }
}; 