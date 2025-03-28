import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';
import './Events.css';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        heading: '',
        tagline: '',
        description: '',
        image_url: '',
        status: 'Upcoming'
    });
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    // Fetch events
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError('');

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to load events');
        } finally {
            setLoading(false);
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

            // Generate unique filename with only allowed extensions
            const fileExt = file.name.split('.').pop().toLowerCase();
            if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
                throw new Error('Invalid file extension.');
            }

            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `event-images/${fileName}`;

            // Upload file to Supabase Storage
            const { error: uploadError, data } = await supabase.storage
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

            const eventData = { ...formData };
            let result;

            if (selectedEvent) {
                // Update existing event
                const { data, error } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', selectedEvent.id);

                if (error) throw error;
                result = data;
            } else {
                // Create new event
                const { data, error } = await supabase
                    .from('events')
                    .insert([eventData]);

                if (error) throw error;
                result = data;
            }

            await fetchEvents();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving event:', error);
            setError('Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            setLoading(true);
            setError('');

            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;

            await fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Failed to delete event');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setFormData({
            heading: event.heading,
            tagline: event.tagline || '',
            description: event.description,
            image_url: event.image_url || '',
            status: event.status
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setFormData({
            heading: '',
            tagline: '',
            description: '',
            image_url: '',
            status: 'Upcoming'
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
            const filePath = `event-content-images/${fileName}`;

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

    if (loading && !events.length) {
        return (
            <div className="events-loading">
                Loading events...
            </div>
        );
    }

    return (
        <div className="events-container">
            <div className="events-header">
                <h1>Events Management</h1>
                <button 
                    className="event-add-button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add New Event
                </button>
            </div>

            {error && (
                <div className="events-error">
                    {error}
                </div>
            )}

            <div className="events-list">
                {events.map(event => (
                    <div key={event.id} className="event-card">
                        {event.image_url && (
                            <img 
                                src={event.image_url} 
                                alt={event.heading}
                                className="event-image"
                            />
                        )}
                        <div className="event-content">
                            <h2>{event.heading}</h2>
                            {event.tagline && <p className="event-tagline">{event.tagline}</p>}
                            <div 
                                className="event-description"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                            <div className="event-footer">
                                <span className={`event-status status-${event.status.toLowerCase()}`}>
                                    {event.status}
                                </span>
                                <div className="event-actions">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="event-edit-button"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="event-delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedEvent ? 'Edit Event' : 'Add New Event'}</h2>
                        <form onSubmit={handleSubmit} className="event-form">
                            <div className="form-group">
                                <label htmlFor="heading">Heading</label>
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
                                <label htmlFor="description">Description</label>
                                <Editor
                                    apiKey="lvfyum4dnqydc0gvbs8qi8fv7tgy4mi78km2sa2flziuj3eb"

                                    init={{
                                        height: 500, // Increased height
                                        menubar: 'file edit view insert format tools table help',
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
                                            'emoticons', 'paste', 'hr', 'textcolor', 'imagetools'
                                        ],
                                        toolbar1: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
                                        toolbar2: 'forecolor backcolor | link image media | table emoticons hr | removeformat code fullscreen help',
                                        style_formats: [
                                            { title: 'Headings', items: [
                                                { title: 'Heading 2', format: 'h2' },
                                                { title: 'Heading 3', format: 'h3' },
                                                { title: 'Heading 4', format: 'h4' }
                                            ]},
                                            { title: 'Inline', items: [
                                                { title: 'Bold', format: 'bold' },
                                                { title: 'Italic', format: 'italic' },
                                                { title: 'Underline', format: 'underline' },
                                                { title: 'Strikethrough', format: 'strikethrough' },
                                                { title: 'Code', format: 'code' }
                                            ]},
                                            { title: 'Blocks', items: [
                                                { title: 'Paragraph', format: 'p' },
                                                { title: 'Blockquote', format: 'blockquote' },
                                                { title: 'Div', format: 'div' },
                                                { title: 'Pre', format: 'pre' }
                                            ]}
                                        ],
                                        content_style: `
                                            body { 
                                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                                                font-size: 16px;
                                                line-height: 1.6;
                                                color: #333;
                                                max-width: 100%;
                                                padding: 1rem;
                                            }
                                            h2 { font-size: 1.75em; margin: 1.5em 0 0.75em; }
                                            h3 { font-size: 1.5em; margin: 1.5em 0 0.75em; }
                                            h4 { font-size: 1.25em; margin: 1.5em 0 0.75em; }
                                            p { margin: 0 0 1em; }
                                            blockquote { 
                                                margin: 1em 0;
                                                padding: 0.5em 1em;
                                                border-left: 4px solid #e0e0e0;
                                                background: #f8f9fe;
                                            }
                                            img {
                                                max-width: 100%;
                                                height: auto;
                                                display: block;
                                                margin: 1em auto;
                                            }
                                            table {
                                                border-collapse: collapse;
                                                width: 100%;
                                                margin: 1em 0;
                                            }
                                            table td, table th {
                                                border: 1px solid #e0e0e0;
                                                padding: 0.5em;
                                            }
                                        `,
                                        // Image upload settings
                                        images_upload_handler: handleEditorImageUpload,
                                        automatic_uploads: true,
                                        file_picker_types: 'image',
                                        // Additional image settings
                                        image_title: true,
                                        image_caption: true,
                                        image_advtab: true,
                                        image_dimensions: true,
                                        // Image upload validation
                                        images_upload_credentials: true,
                                        images_reuse_filename: false,
                                        images_file_types: 'jpeg,jpg,png,gif,webp',
                                        // Additional editor settings
                                        paste_data_images: true,
                                        browser_spellcheck: true,
                                        contextmenu: 'link image table',
                                        resize: true,
                                        statusbar: true,
                                        branding: false
                                    }}
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

                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
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
                                    {loading ? 'Saving...' : 'Save Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 