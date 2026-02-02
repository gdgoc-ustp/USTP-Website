import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabase = null;

function getSupabase() {
    if (!supabase) {
        const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

        if (!url || !key) {
            console.error('Missing SUPABASE_URL or key');
            return null;
        }

        supabase = createClient(url, key);
    }
    return supabase;
}

// generates a random short code
function generateShortCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const client = getSupabase();
    if (!client) {
        return res.status(500).json({ error: 'Database configuration error' });
    }

    try {
        switch (req.method) {
            case 'GET': {
                const { code, id, all } = req.query;

                // get single url by code (for redirect)
                if (code) {
                    const { data, error } = await client
                        .from('short_urls')
                        .select('*')
                        .eq('short_code', code)
                        .eq('is_active', true)
                        .single();

                    if (error || !data) {
                        return res.status(404).json({ error: 'URL not found' });
                    }

                    // check expiration
                    if (data.expires_at && new Date(data.expires_at) < new Date()) {
                        return res.status(410).json({ error: 'URL has expired' });
                    }

                    // increment click count
                    await client.rpc('increment_click_count', { url_code: code });

                    return res.status(200).json({ data });
                }

                // get single by id
                if (id) {
                    const { data, error } = await client
                        .from('short_urls')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (error) throw error;
                    return res.status(200).json({ data });
                }

                // list all urls (admin view)
                const { data, error } = await client
                    .from('short_urls')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return res.status(200).json({ data });
            }

            case 'POST': {
                const { original_url, short_code, title, expires_at, created_by } = req.body;

                if (!original_url) {
                    return res.status(400).json({ error: 'original_url is required' });
                }

                // validate url
                try {
                    new URL(original_url);
                } catch {
                    return res.status(400).json({ error: 'Invalid URL format' });
                }

                // use provided code or generate one
                let code = short_code?.trim();
                if (code) {
                    // validate custom code format
                    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
                        return res.status(400).json({ error: 'Short code can only contain letters, numbers, hyphens, and underscores' });
                    }

                    // check if code already exists
                    const { data: existing } = await client
                        .from('short_urls')
                        .select('id')
                        .eq('short_code', code)
                        .single();

                    if (existing) {
                        return res.status(409).json({ error: 'Short code already in use' });
                    }
                } else {
                    // generate unique code
                    let attempts = 0;
                    do {
                        code = generateShortCode();
                        const { data: existing } = await client
                            .from('short_urls')
                            .select('id')
                            .eq('short_code', code)
                            .single();
                        if (!existing) break;
                        attempts++;
                    } while (attempts < 10);

                    if (attempts >= 10) {
                        return res.status(500).json({ error: 'Failed to generate unique code' });
                    }
                }

                const { data, error } = await client
                    .from('short_urls')
                    .insert([{
                        short_code: code,
                        original_url,
                        title: title || null,
                        expires_at: expires_at || null,
                        created_by: created_by || null
                    }])
                    .select()
                    .single();

                if (error) throw error;
                return res.status(201).json({ data });
            }

            case 'PUT': {
                const { id, original_url, short_code, title, is_active, expires_at } = req.body;

                if (!id) {
                    return res.status(400).json({ error: 'id is required' });
                }

                const updates = { updated_at: new Date().toISOString() };

                if (original_url !== undefined) {
                    try {
                        new URL(original_url);
                        updates.original_url = original_url;
                    } catch {
                        return res.status(400).json({ error: 'Invalid URL format' });
                    }
                }

                if (short_code !== undefined) {
                    if (!/^[a-zA-Z0-9_-]+$/.test(short_code)) {
                        return res.status(400).json({ error: 'Invalid short code format' });
                    }

                    // check if new code is already used by another url
                    const { data: existing } = await client
                        .from('short_urls')
                        .select('id')
                        .eq('short_code', short_code)
                        .neq('id', id)
                        .single();

                    if (existing) {
                        return res.status(409).json({ error: 'Short code already in use' });
                    }
                    updates.short_code = short_code;
                }

                if (title !== undefined) updates.title = title;
                if (is_active !== undefined) updates.is_active = is_active;
                if (expires_at !== undefined) updates.expires_at = expires_at;

                const { data, error } = await client
                    .from('short_urls')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;
                return res.status(200).json({ data });
            }

            case 'DELETE': {
                const { id } = req.query;

                if (!id) {
                    return res.status(400).json({ error: 'id is required' });
                }

                const { error } = await client
                    .from('short_urls')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                return res.status(204).end();
            }

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Short URLs API error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
