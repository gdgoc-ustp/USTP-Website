/**
 * API Client for USTP Website
 * Abstracts backend API calls, no direct Supabase exposure to frontend
 */

const API_BASE = '/api';

// storage url is still from supabase but we keep it as a constant here
// this avoids exposing env vars in multiple places
const STORAGE_BASE = 'https://yrvykwljzajfkraytbgr.supabase.co/storage/v1/object/public';

/**
 * Fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Blog Posts API
 */
export const posts = {
    async list(options = {}) {
        const params = new URLSearchParams();
        if (options.limit) params.set('limit', options.limit);
        if (options.offset) params.set('offset', options.offset);

        const query = params.toString();
        const { data } = await fetchAPI(`/posts${query ? `?${query}` : ''}`);
        return data;
    },

    async getById(id) {
        const { data } = await fetchAPI(`/posts?id=${id}`);
        return data;
    }
};

/**
 * Events API
 */
export const events = {
    async list(options = {}) {
        const params = new URLSearchParams();
        if (options.status) params.set('status', options.status);

        const query = params.toString();
        const { data } = await fetchAPI(`/events${query ? `?${query}` : ''}`);
        return data;
    },

    async getById(id) {
        const { data } = await fetchAPI(`/events?id=${id}`);
        return data;
    }
};

/**
 * Storage utilities
 */
export const storage = {
    getImageUrl(path, bucket = 'blog-images') {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${STORAGE_BASE}/${bucket}/${path}`;
    }
};

export default {
    posts,
    events,
    storage
};
