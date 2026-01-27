import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';
import { TINYMCE_API_KEY, getEditorConfig } from '../../lib/tinymceConfig';
import './BlogPosts.css';

// Full-page editor component
const BlogPostEditor = ({ formData, setFormData, handleSubmit, handleCloseModal, handleInputChange, handleEditorChange, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, fileInputRef, isDragging, uploadProgress, loading, selectedPost, error, handleEditorImageUpload, handleFileSelect }) => {
    return (
        <div className="full-page-editor">
            <div className="full-page-editor-header">
                <h1>{selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
                <button
                    onClick={handleCloseModal}
                    className="back-to-list-button"
                >
                    ← Back to Posts
                </button>
            </div>

            {error && (
                <div className="events-error full-page-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="blog-post-form full-page-form">
                <div className="editor-content">
                    <div className="editor-main-content">
                        <div className="form-group">
                            <label htmlFor="heading">Title</label>
                            <input
                                type="text"
                                id="heading"
                                name="heading"
                                value={formData.heading}
                                onChange={handleInputChange}
                                required
                                className="full-width-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tagline">Tagline</label>
                            <input
                                type="text"
                                id="tagline"
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleInputChange}
                                className="full-width-input"
                            />
                        </div>

                        <div className="form-group description-group">
                            <label htmlFor="description">Content</label>
                            <Editor
                                apiKey={TINYMCE_API_KEY}
                                init={getEditorConfig(600, handleEditorImageUpload)}
                                value={formData.description}
                                onEditorChange={handleEditorChange}
                            />
                        </div>
                    </div>

                    <div className="editor-sidebar">
                        <div className="sidebar-section">
                            <h3>Featured Image</h3>
                            <div
                                className={`image-drop-zone ${isDragging ? 'dragging' : ''}`}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {formData.image_url ? (
                                    <div className="image-preview">
                                        <img src={formData.image_url} alt="Preview" />
                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFormData(prev => ({ ...prev, image_url: '' }));
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="drop-zone-content">
                                        <p>Drag & drop an image here or click to select</p>
                                        {uploadProgress > 0 && (
                                            <div className="upload-progress">
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="save-button"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (selectedPost ? 'Update Post' : 'Create Post')}
                            </button>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default function BlogPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [formData, setFormData] = useState({
        heading: '',
        tagline: '',
        description: '',
        image_url: ''
    });
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    // New state for search, filtering, sorting and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    // Edit mode state (modal or full-page)
    const [editMode, setEditMode] = useState('modal'); // 'modal' or 'fullpage'

    // Fetch posts
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError('');

            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load blog posts');
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort posts
    const filteredPosts = posts
        .filter(post => {
            // Apply search filter to heading and tagline
            if (searchTerm && !post.heading.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !post.tagline?.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            // Apply sorting
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    // Calculate pagination
    const indexOfLastPost = currentPage * itemsPerPage;
    const indexOfFirstPost = indexOfLastPost - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    // Generate pagination controls
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>
                {pageNumbers}
                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        );
    };

    // Handle sort toggle
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditorChange = (content) => {
        setFormData(prev => ({
            ...prev,
            description: content
        }));
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            await uploadImage(file);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await uploadImage(file);
        }
    };

    const uploadImage = async (file) => {
        try {
            // Security checks
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            // Validate file type
            if (!allowedTypes.includes(file.type)) {
                throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
            }

            // Validate file size
            if (file.size > maxSize) {
                throw new Error('File is too large. Maximum size is 5MB.');
            }

            setLoading(true);
            setError('');

            // Generate unique filename
            const fileExt = file.name.split('.').pop().toLowerCase();
            if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
                throw new Error('Invalid file extension.');
            }

            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `blog-thumbnails/${fileName}`;

            // Upload file to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type, // Explicitly set content type
                    onUploadProgress: (progress) => {
                        setUploadProgress((progress.loaded / progress.total) * 100);
                    },
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData(prev => ({
                ...prev,
                image_url: publicUrl
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            setError(error.message || 'Failed to upload image');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');

            // Get user ID if available (for authenticated users)
            const { data: { user } } = await supabase.auth.getUser();

            const postData = {
                heading: formData.heading,
                tagline: formData.tagline,
                description: formData.description,
                image_url: formData.image_url,
                // Only include author_id if there's a user - otherwise it will be NULL
                // This works with the updated SQL schema that allows NULL values
                ...(user?.id && { author_id: user.id })
            };

            if (selectedPost) {
                // Update existing post
                const { error } = await supabase
                    .from('blog_posts')
                    .update({
                        ...postData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', selectedPost.id);

                if (error) throw error;
            } else {
                // Create new post
                const { error } = await supabase
                    .from('blog_posts')
                    .insert([{
                        ...postData,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }]);

                if (error) throw error;
            }

            await fetchPosts();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving post:', error);
            setError(`Failed to save blog post: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            setLoading(true);
            setError('');

            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            await fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete blog post');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (post) => {
        setSelectedPost(post);
        setFormData({
            heading: post.heading,
            tagline: post.tagline || '',
            description: post.description,
            image_url: post.image_url || ''
        });
        setEditMode('modal');
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedPost(null);
        setFormData({
            heading: '',
            tagline: '',
            description: '',
            image_url: ''
        });
        setEditMode('modal');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditMode('modal');
        setSelectedPost(null);
        setFormData({
            heading: '',
            tagline: '',
            description: '',
            image_url: ''
        });
    };

    const handleEditorImageUpload = async (blobInfo) => {
        try {
            const file = blobInfo.blob();

            // Security checks
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
            }

            if (file.size > maxSize) {
                throw new Error('File is too large. Maximum size is 5MB.');
            }

            // Generate unique filename
            const fileExt = file.type.split('/')[1];
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `blog-content/${fileName}`;

            // Upload to Supabase
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    // Switch to full-page editing mode
    const switchToFullPage = () => {
        setEditMode('fullpage');
    };

    if (loading && !posts.length) {
        return (
            <div className="events-loading">
                <div className="loading-spinner"></div>
                <p>Loading blog posts...</p>
            </div>
        );
    }

    // If in full-page edit mode, render the editor component
    if (editMode === 'fullpage' && isModalOpen) {
        return (
            <BlogPostEditor
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                handleCloseModal={handleCloseModal}
                handleInputChange={handleInputChange}
                handleEditorChange={handleEditorChange}
                handleDragEnter={handleDragEnter}
                handleDragLeave={handleDragLeave}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                fileInputRef={fileInputRef}
                isDragging={isDragging}
                uploadProgress={uploadProgress}
                loading={loading}
                selectedPost={selectedPost}
                error={error}
                handleEditorImageUpload={handleEditorImageUpload}
                handleFileSelect={handleFileSelect}
            />
        );
    }

    return (
        <div className="events-container">
            <div className="events-header">
                <h1>Blog Posts Management</h1>
                <button
                    className="event-add-button"
                    onClick={handleAddNew}
                >
                    Add New Post
                </button>
            </div>

            {error && (
                <div className="events-error">
                    {error}
                </div>
            )}

            <div className="events-filters">
                <div className="admin-search-container">
                    <input
                        type="text"
                        placeholder="Search blog posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
            </div>

            {filteredPosts.length === 0 ? (
                <div className="no-events-message">
                    <p>No blog posts found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className="events-table-container">
                        <table className="events-table">
                            <thead>
                                <tr>
                                    <th className="image-column">Image</th>
                                    <th
                                        className={`sortable-column ${sortField === 'heading' ? 'active' : ''}`}
                                        onClick={() => handleSort('heading')}
                                    >
                                        Title {sortField === 'heading' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th
                                        className={`sortable-column created-column ${sortField === 'created_at' ? 'active' : ''}`}
                                        onClick={() => handleSort('created_at')}
                                    >
                                        Created {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th
                                        className={`sortable-column updated-column ${sortField === 'updated_at' ? 'active' : ''}`}
                                        onClick={() => handleSort('updated_at')}
                                    >
                                        Updated {sortField === 'updated_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="actions-column">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts.map(post => (
                                    <tr key={post.id} className="event-row">
                                        <td className="image-cell" data-label="Image">
                                            {post.image_url ? (
                                                <div className="thumbnail-container">
                                                    <img
                                                        src={post.image_url}
                                                        alt={post.heading}
                                                        className="event-thumbnail"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="no-image">No image</div>
                                            )}
                                        </td>
                                        <td className="title-cell" data-label="Title">
                                            <div className="event-title">{post.heading}</div>
                                            {post.tagline && <div className="event-subtitle">{post.tagline}</div>}
                                        </td>
                                        <td className="created-cell" data-label="Created">{formatDate(post.created_at)}</td>
                                        <td className="updated-cell" data-label="Updated">{formatDate(post.updated_at)}</td>
                                        <td className="actions-cell" data-label="Actions">
                                            <div className="event-action-buttons">
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="event-edit-button"
                                                    title="Edit post"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="event-delete-button"
                                                    title="Delete post"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {renderPagination()}
                </>
            )}

            {/* Modal with resize capability and full-page button */}
            {isModalOpen && editMode === 'modal' && (
                <div className="modal-overlay">
                    <div className="modal-content resizable">
                        <div className="modal-header">
                            <h2>{selectedPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
                            <div className="modal-controls">
                                <button
                                    type="button"
                                    className="fullscreen-button"
                                    onClick={switchToFullPage}
                                    title="Edit in full screen"
                                >
                                    <span className="fullscreen-icon">⛶</span>
                                </button>
                                <button
                                    type="button"
                                    className="close-button"
                                    onClick={handleCloseModal}
                                    title="Close"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="event-form">
                            <div className="form-group">
                                <label htmlFor="heading">Title</label>
                                <input
                                    type="text"
                                    id="heading"
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="tagline">Tagline</label>
                                <input
                                    type="text"
                                    id="tagline"
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Content</label>
                                <Editor
                                    apiKey={TINYMCE_API_KEY}
                                    init={getEditorConfig(500, handleEditorImageUpload)}
                                    value={formData.description}
                                    onEditorChange={handleEditorChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Thumbnail Image</label>
                                <div
                                    className={`image-drop-zone ${isDragging ? 'dragging' : ''}`}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {formData.image_url ? (
                                        <div className="image-preview">
                                            <img src={formData.image_url} alt="Preview" />
                                            <button
                                                type="button"
                                                className="remove-image"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, image_url: '' }));
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="drop-zone-content">
                                            <p>Drag & drop an image here or click to select</p>
                                            {uploadProgress > 0 && (
                                                <div className="upload-progress">
                                                    <div
                                                        className="progress-bar"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="modal-cancel-button"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="modal-save-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Post'}
                                </button>
                            </div>
                        </form>

                        {/* Resize handle */}
                        <div className="resize-handle"></div>
                    </div>
                </div>
            )}
        </div>
    );
} 