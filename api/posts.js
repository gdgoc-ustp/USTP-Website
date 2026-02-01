import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

    try {
        const { id, limit, offset } = req.query;

        // single post by id
        if (id) {
            const { data, error } = await supabase
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
        let query = supabase
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
        return res.status(500).json({ error: 'Failed to fetch posts' });
    }
}
