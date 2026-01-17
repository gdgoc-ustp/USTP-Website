import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Create admin client with service key (server-side only)
const supabaseAdmin = SUPABASE_SERVICE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : null;

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Check if admin client is configured
    if (!supabaseAdmin) {
        console.error('Supabase admin client is not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Basic authentication check (you should implement proper auth)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
    }

    try {
        const { action, table, data, filters, id } = req.body;

        if (!action || !table) {
            return res.status(400).json({ error: 'Action and table are required' });
        }

        let result;

        switch (action) {
            case 'select':
                if (filters) {
                    let query = supabaseAdmin.from(table).select('*');
                    Object.entries(filters).forEach(([key, value]) => {
                        query = query.eq(key, value);
                    });
                    result = await query;
                } else {
                    result = await supabaseAdmin.from(table).select('*');
                }
                break;

            case 'insert':
                if (!data) {
                    return res.status(400).json({ error: 'Data is required for insert' });
                }
                result = await supabaseAdmin.from(table).insert(data);
                break;

            case 'update':
                if (!data || !id) {
                    return res.status(400).json({ error: 'Data and ID are required for update' });
                }
                result = await supabaseAdmin.from(table).update(data).eq('id', id);
                break;

            case 'delete':
                if (!id) {
                    return res.status(400).json({ error: 'ID is required for delete' });
                }
                result = await supabaseAdmin.from(table).delete().eq('id', id);
                break;

            case 'count':
                result = await supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
                break;

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

        if (result.error) {
            console.error('Supabase admin operation error:', result.error);
            return res.status(400).json({ error: result.error.message });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error('Error in admin operation:', error);
        return res.status(500).json({ 
            error: 'Internal server error during admin operation' 
        });
    }
}
