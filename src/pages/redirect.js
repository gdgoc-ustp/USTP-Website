import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './redirect.css';

export default function Redirect() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleRedirect = async () => {
            if (!code) {
                setError('No redirect code provided');
                setLoading(false);
                return;
            }

            try {
                // fetch the url by short code
                const { data, error: fetchError } = await supabase
                    .from('short_urls')
                    .select('*')
                    .eq('short_code', code)
                    .eq('is_active', true)
                    .single();

                if (fetchError || !data) {
                    setError('This link does not exist or has been disabled');
                    setLoading(false);
                    return;
                }

                // check if expired
                if (data.expires_at && new Date(data.expires_at) < new Date()) {
                    setError('This link has expired');
                    setLoading(false);
                    return;
                }

                // increment click count
                await supabase
                    .from('short_urls')
                    .update({
                        clicks: (data.clicks || 0) + 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', data.id);

                // redirect to the original url
                window.location.href = data.original_url;

            } catch (err) {
                console.error('redirect error:', err);
                setError('Something went wrong. Please try again.');
                setLoading(false);
            }
        };

        handleRedirect();
    }, [code, navigate]);

    if (loading) {
        return (
            <div className="redirect-container">
                <div className="redirect-content">
                    <div className="redirect-spinner"></div>
                    <p>Redirecting...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="redirect-container">
                <div className="redirect-content error">
                    <h1>Oops!</h1>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')}>Go Home</button>
                </div>
            </div>
        );
    }

    return null;
}
