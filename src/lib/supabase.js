import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
        url: supabaseUrl ? 'Set' : 'Missing',
        key: supabaseAnonKey ? 'Set' : 'Missing'
    });
}

export const supabase = createClient(
    supabaseUrl || 'https://yrvykwljzajfkraytbgr.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlydnlrd2xqemFqZmtyYXl0YmdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MjczMjIsImV4cCI6MjA1MjUwMzMyMn0.WzWYdut9GkGSjH5cehOcuc6YzZR5g-XQgZ3Kh9d_6UA'
);

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
        const { count, error } = await supabase
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