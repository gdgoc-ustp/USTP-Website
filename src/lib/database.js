import { supabase } from './supabase';

// Events functions
export const getEvents = async (filters = {}) => {
    let query = supabase.from('events').select('*');
    
    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    
    if (filters.limit) {
        query = query.limit(filters.limit);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
};

export const getEventById = async (id) => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
};

export const createEvent = async (eventData) => {
    const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();
    return { data, error };
};

export const updateEvent = async (id, updates) => {
    const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    return { data, error };
};

export const deleteEvent = async (id) => {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
    return { error };
};

// Blog posts functions
export const getBlogPosts = async (filters = {}) => {
    let query = supabase
        .from('blog_posts')
        .select(`
            *,
            author:users(name, email)
        `);
    
    if (filters.authorId) {
        query = query.eq('author_id', filters.authorId);
    }
    
    if (filters.limit) {
        query = query.limit(filters.limit);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
};

export const getBlogPostById = async (id) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select(`
            *,
            author:users(name, email)
        `)
        .eq('id', id)
        .single();
    return { data, error };
};

export const createBlogPost = async (postData) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();
    return { data, error };
};

export const updateBlogPost = async (id, updates) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    return { data, error };
};

export const deleteBlogPost = async (id) => {
    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
    return { error };
};

// Analytics functions
export const getEventStats = async () => {
    const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('status');
    
    if (eventsError) return { error: eventsError };
    
    const stats = {
        total: events.length,
        upcoming: events.filter(e => e.status === 'Upcoming').length,
        completed: events.filter(e => e.status === 'Completed').length,
        cancelled: events.filter(e => e.status === 'Cancelled').length
    };
    
    return { data: stats };
};

export const getBlogStats = async () => {
    const { count: totalPosts, error: postsError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
    
    if (postsError) return { error: postsError };
    
    const { count: totalAuthors, error: authorsError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gt('permission', 'VIEWER');
    
    if (authorsError) return { error: authorsError };
    
    return {
        data: {
            totalPosts,
            totalAuthors
        }
    };
}; 