import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check active sessions and sets the user
        const session = supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Get user profile data
    useEffect(() => {
        if (user) {
            getUserProfile(user.id)
                .then(({ data, error }) => {
                    if (error) setError(error.message);
                    if (data) setUser(prev => ({ ...prev, profile: data }));
                });
        }
    }, [user?.id]);

    const value = {
        signUp: async (email, password) => {
            try {
                setLoading(true);
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                return data;
            } catch (error) {
                setError(error.message);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        signIn: async (email, password) => {
            try {
                setLoading(true);
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                return data;
            } catch (error) {
                setError(error.message);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        signOut: async () => {
            try {
                setLoading(true);
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
            } catch (error) {
                setError(error.message);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        user,
        loading,
        error,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 