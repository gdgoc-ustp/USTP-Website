import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './UrlShortener.css';

export default function UrlShortener() {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [formData, setFormData] = useState({
        original_url: '',
        short_code: '',
        title: '',
        expires_at: ''
    });

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            setLoading(true);
            setError('');

            const { data, error } = await supabase
                .from('short_urls')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUrls(data || []);
        } catch (err) {
            console.error('error fetching urls:', err);
            setError('failed to load urls. make sure the database table exists.');
        } finally {
            setLoading(false);
        }
    };

    // filtering
    const filteredUrls = urls.filter(url => {
        const search = searchTerm.toLowerCase();
        return (
            url.short_code?.toLowerCase().includes(search) ||
            url.original_url?.toLowerCase().includes(search) ||
            url.title?.toLowerCase().includes(search)
        );
    });

    // pagination
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentUrls = filteredUrls.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);

    // stats
    const stats = {
        total: urls.length,
        active: urls.filter(u => u.is_active).length,
        totalClicks: urls.reduce((sum, u) => sum + (u.clicks || 0), 0)
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');

            const { data: { user } } = await supabase.auth.getUser();

            if (selectedUrl) {
                // update existing
                const { error } = await supabase
                    .from('short_urls')
                    .update({
                        original_url: formData.original_url,
                        short_code: formData.short_code,
                        title: formData.title || null,
                        expires_at: formData.expires_at || null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', selectedUrl.id);

                if (error) throw error;
            } else {
                // create new
                const codeToUse = formData.short_code?.trim() || generateShortCode();

                const { error } = await supabase
                    .from('short_urls')
                    .insert([{
                        original_url: formData.original_url,
                        short_code: codeToUse,
                        title: formData.title || null,
                        expires_at: formData.expires_at || null,
                        created_by: user?.id || null
                    }]);

                if (error) throw error;
            }

            await fetchUrls();
            handleCloseModal();
        } catch (err) {
            console.error('error saving url:', err);
            setError(err.message || 'failed to save url');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('delete this short url?')) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('short_urls')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchUrls();
        } catch (err) {
            console.error('error deleting url:', err);
            setError('failed to delete url');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (url) => {
        try {
            const { error } = await supabase
                .from('short_urls')
                .update({
                    is_active: !url.is_active,
                    updated_at: new Date().toISOString()
                })
                .eq('id', url.id);

            if (error) throw error;
            await fetchUrls();
        } catch (err) {
            console.error('error toggling url status:', err);
            setError('failed to update url status');
        }
    };

    const handleEdit = (url) => {
        setSelectedUrl(url);
        setFormData({
            original_url: url.original_url,
            short_code: url.short_code,
            title: url.title || '',
            expires_at: url.expires_at ? formatDateForInput(url.expires_at) : ''
        });
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedUrl(null);
        setFormData({
            original_url: '',
            short_code: '',
            title: '',
            expires_at: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUrl(null);
        setFormData({
            original_url: '',
            short_code: '',
            title: '',
            expires_at: ''
        });
        setError('');
    };

    const copyToClipboard = async (shortCode, id) => {
        const fullUrl = `${window.location.origin}/go/${shortCode}`;
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('failed to copy:', err);
        }
    };

    const generateShortCode = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset();
        const local = new Date(date.getTime() - offset * 60000);
        return local.toISOString().slice(0, 16);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid';
        }
    };

    const getUrlStatus = (url) => {
        if (!url.is_active) return 'inactive';
        if (url.expires_at && new Date(url.expires_at) < new Date()) return 'expired';
        return 'active';
    };

    if (loading && !urls.length) {
        return (
            <div className="url-loading">
                <div className="url-loading-spinner"></div>
                <p>Loading URLs...</p>
            </div>
        );
    }

    return (
        <div className="url-shortener-container">
            <div className="url-shortener-header">
                <h1>URL Shortener</h1>
                <button className="add-url-button" onClick={handleAddNew}>
                    + Add Short URL
                </button>
            </div>

            {error && <div className="url-error">{error}</div>}

            <div className="url-stats">
                <div className="url-stat-card total">
                    <h3>Total URLs</h3>
                    <p>{stats.total}</p>
                </div>
                <div className="url-stat-card active">
                    <h3>Active</h3>
                    <p>{stats.active}</p>
                </div>
                <div className="url-stat-card clicks">
                    <h3>Total Clicks</h3>
                    <p>{stats.totalClicks}</p>
                </div>
            </div>

            <div className="url-filters">
                <input
                    type="text"
                    placeholder="Search URLs..."
                    className="url-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredUrls.length === 0 ? (
                <div className="no-urls-message">
                    <p>No short URLs found. Create one to get started!</p>
                </div>
            ) : (
                <>
                    <div className="url-table-container">
                        <table className="url-table">
                            <thead>
                                <tr>
                                    <th>Short Code</th>
                                    <th>Original URL</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Clicks</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUrls.map(url => {
                                    const status = getUrlStatus(url);
                                    return (
                                        <tr key={url.id}>
                                            <td>
                                                <div className="short-code-cell">
                                                    <span className="short-code">/go/{url.short_code}</span>
                                                    <button
                                                        className={`copy-button ${copiedId === url.id ? 'copied' : ''}`}
                                                        onClick={() => copyToClipboard(url.short_code, url.id)}
                                                        title="Copy full URL"
                                                    >
                                                        {copiedId === url.id ? '✓' : '📋'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="original-url">
                                                    <a href={url.original_url} target="_blank" rel="noopener noreferrer">
                                                        {url.original_url}
                                                    </a>
                                                </div>
                                            </td>
                                            <td>{url.title || '-'}</td>
                                            <td>
                                                <span className={`status-badge ${status}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="clicks-cell">{url.clicks || 0}</td>
                                            <td>{formatDate(url.created_at)}</td>
                                            <td>
                                                <div className="url-actions">
                                                    <button
                                                        className="url-action-btn edit"
                                                        onClick={() => handleEdit(url)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="url-action-btn toggle"
                                                        onClick={() => handleToggleActive(url)}
                                                    >
                                                        {url.is_active ? 'Disable' : 'Enable'}
                                                    </button>
                                                    <button
                                                        className="url-action-btn delete"
                                                        onClick={() => handleDelete(url.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="url-pagination">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                &lt;
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={currentPage === i + 1 ? 'active' : ''}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* modal for create/edit */}
            {isModalOpen && (
                <div className="url-modal-overlay" onClick={handleCloseModal}>
                    <div className="url-modal" onClick={e => e.stopPropagation()}>
                        <div className="url-modal-header">
                            <h2>{selectedUrl ? 'Edit Short URL' : 'Create Short URL'}</h2>
                            <button className="close-modal-btn" onClick={handleCloseModal}>×</button>
                        </div>
                        <form className="url-form" onSubmit={handleSubmit}>
                            {error && <div className="url-error">{error}</div>}

                            <div className="url-form-group">
                                <label htmlFor="original_url">Destination URL *</label>
                                <input
                                    type="url"
                                    id="original_url"
                                    name="original_url"
                                    value={formData.original_url}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/very/long/url"
                                    required
                                />
                            </div>

                            <div className="url-form-group short-code-group">
                                <label htmlFor="short_code">Short Code</label>
                                <div className="short-code-input-wrapper">
                                    <span className="short-code-prefix">/go/</span>
                                    <input
                                        type="text"
                                        id="short_code"
                                        name="short_code"
                                        value={formData.short_code}
                                        onChange={handleInputChange}
                                        placeholder="leave empty to auto-generate"
                                        pattern="[a-zA-Z0-9_-]+"
                                    />
                                </div>
                                <span className="field-hint">only letters, numbers, hyphens and underscores</span>
                            </div>

                            <div className="url-form-group">
                                <label htmlFor="title">Title (optional)</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="for your reference"
                                />
                            </div>

                            <div className="url-form-group">
                                <label htmlFor="expires_at">Expires At (optional)</label>
                                <input
                                    type="datetime-local"
                                    id="expires_at"
                                    name="expires_at"
                                    value={formData.expires_at}
                                    onChange={handleInputChange}
                                />
                                <span className="field-hint">leave empty for no expiration</span>
                            </div>

                            <div className="url-form-actions">
                                <button
                                    type="button"
                                    className="url-form-btn secondary"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="url-form-btn primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (selectedUrl ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
