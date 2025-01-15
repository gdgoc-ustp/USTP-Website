import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';
import './BlogPosts.css';

const BlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
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

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data);
        } catch (error) {
            setError('Failed to fetch blog posts');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (content) => {
        setFormData(prev => ({ ...prev, description: content }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length) {
            handleImageUpload(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length) {
            handleImageUpload(files[0]);
        }
    };

    const handleImageUpload = async (file) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            setError('Only JPEG, PNG, GIF, and WebP images are allowed');
            return;
        }

        if (file.size > maxSize) {
            setError('File size must be less than 5MB');
            return;
        }

        try {
            const fileExt = file.name.split('.').pop().toLowerCase();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `blog-thumbnails/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    contentType: file.type
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            setError(null);
        } catch (error) {
            setError('Failed to upload image');
            console.error('Error:', error);
        }
    };

    const handleEditorImageUpload = async (blobInfo) => {
        const file = blobInfo.blob();
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            return Promise.reject('Only JPEG, PNG, GIF, and WebP images are allowed');
        }

        if (file.size > maxSize) {
            return Promise.reject('File size must be less than 5MB');
        }

        try {
            const fileExt = file.name.split('.').pop().toLowerCase();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `blog-content/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    contentType: file.type
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error:', error);
            return Promise.reject('Image upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Get the current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            // Prepare post data with author_id
            const postData = {
                ...formData,
                author_id: user.id
            };

            if (selectedPost) {
                const { error } = await supabase
                    .from('blog_posts')
                    .update({
                        ...postData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', selectedPost.id);

                if (error) throw error;
            } else {
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
            setError('Failed to save blog post');
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const { error } = await supabase
                    .from('blog_posts')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                await fetchPosts();
            } catch (error) {
                setError('Failed to delete blog post');
                console.error('Error:', error);
            }
        }
    };

    const handleEdit = (post) => {
        setSelectedPost(post);
        setFormData({
            heading: post.heading,
            tagline: post.tagline,
            description: post.description,
            image_url: post.image_url
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPost(null);
        setFormData({
            heading: '',
            tagline: '',
            description: '',
            image_url: ''
        });
        setError(null);
    };

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Never';
        
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="admin-loading">Loading blog posts...</div>;

    return (
        <div className="blog-posts-container">
            <div className="blog-posts-header">
                <h1>Blog Posts Management</h1>
                <button onClick={() => setShowModal(true)} className="add-post-button">
                    Add New Post
                </button>
            </div>

            {error && <div className="admin-error-message">{error}</div>}

            <div className="blog-posts-grid">
                {posts.map(post => (
                    <div key={post.id} className="blog-post-card">
                        {post.image_url && (
                            <img src={post.image_url} alt={post.heading} className="post-thumbnail" />
                        )}
                        <div className="post-content">
                            <h3>{post.heading}</h3>
                            <p className="post-tagline">{post.tagline}</p>
                            <div className="post-description" dangerouslySetInnerHTML={{ __html: post.description }} />
                            <div className="post-metadata">
                                <div className="post-author">
                                    <span>Author: {post.author?.email}</span>
                                </div>
                                <div className="post-dates">
                                    <span>Created: {formatDate(post.created_at)}</span>
                                    <span>Updated: {formatDate(post.updated_at)}</span>
                                </div>
                            </div>
                            <div className="post-actions">
                                <button onClick={() => handleEdit(post)}>Edit</button>
                                <button onClick={() => handleDelete(post.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedPost ? 'Edit Post' : 'Add New Post'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Heading:</label>
                                <input
                                    type="text"
                                    name="heading"
                                    value={formData.heading}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Tagline:</label>
                                <input
                                    type="text"
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description:</label>
                                <Editor
                                    apiKey="lvfyum4dnqydc0gvbs8qi8fv7tgy4mi78km2sa2flziuj3eb"
                                    init={{
                                        height: 400,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | image | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                        images_upload_handler: handleEditorImageUpload
                                    }}
                                    value={formData.description}
                                    onEditorChange={handleEditorChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Thumbnail Image:</label>
                                <div
                                    className={`image-drop-zone ${isDragging ? 'dragging' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
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
                                            <p className="file-requirements">
                                                Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="submit">{selectedPost ? 'Update' : 'Create'}</button>
                                <button type="button" onClick={handleCloseModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogPosts; 