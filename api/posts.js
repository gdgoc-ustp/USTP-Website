import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// load env vars for local dev
dotenv.config();

let supabase = null;

function getSupabase() {
    if (!supabase) {
        const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
        const key = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

        if (!url || !key) {
            console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
            return null;
        }

        supabase = createClient(url, key);
    }
    return supabase;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = getSupabase();
    if (!client) {
        return res.status(500).json({ error: 'Database configuration error' });
    }

    try {
        const { id, limit, offset } = req.query;

        // single post by id
        if (id) {
            const { data, error } = await client
                .from('blog_posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return res.status(404).json({ error: 'Post not found' });
                }
                throw error;
            }

            return res.status(200).json({ data });
        }

        // list posts with optional pagination
        let query = client
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (limit) {
            query = query.limit(parseInt(limit, 10));
        }

        if (offset) {
            query = query.range(parseInt(offset, 10), parseInt(offset, 10) + (parseInt(limit, 10) || 10) - 1);
        }

        const { data, error } = await query;

        if (error) throw error;

        return res.status(200).json({ data });

    } catch (error) {
        console.error('Posts API error:', error);
        return res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
    }
}
