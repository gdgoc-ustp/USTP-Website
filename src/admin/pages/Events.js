import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';
import { TINYMCE_API_KEY, getEditorConfig } from '../../lib/tinymceConfig';
//import './Events.css';

// Add this component for full-page event editing
const EventEditor = ({ formData, setFormData, handleSubmit, handleCloseModal, handleInputChange, handleEditorChange, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, fileInputRef, isDragging, uploadProgress, loading, selectedEvent, error }) => {
    return (
        <div className="full-page-editor">
            <div className="full-page-editor-header">
                <h1>{selectedEvent ? 'Edit Event' : 'Add New Event'}</h1>
                <button
                    onClick={handleCloseModal}
                    className="back-to-list-button"
                >
                    ← Back to Events
                </button>
            </div>

            {error && (
                <div className="events-error full-page-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="event-form full-page-form">
                <div className="editor-content">
                    <div className="editor-main-content">
                        <div className="form-group">
                            <label htmlFor="heading">Heading</label>
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
                            <label htmlFor="description">Description</label>
                            <Editor
                                apiKey={TINYMCE_API_KEY}
                                init={getEditorConfig(600, (blobInfo, success, failure) => {
                                    // Use the same image upload handling logic as in Events component
                                    // This would need to be refactored to be shared between components
                                })}
                                value={formData.description}
                                onEditorChange={handleEditorChange}
                            />
                        </div>
                    </div>

                    <div className="editor-sidebar">
                        <div className="sidebar-section">
                            <h3>Event Details</h3>

                            <div className="form-group">
                                <label htmlFor="event_date">Event Date</label>
                                <input
                                    type="datetime-local"
                                    id="event_date"
                                    name="event_date"
                                    value={formData.event_date}
                                    onChange={handleInputChange}
                                    required
                                />
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

                            <div className="form-group">
                                <label htmlFor="rsvp_link">RSVP Link (Optional)</label>
                                <input
                                    type="url"
                                    id="rsvp_link"
                                    name="rsvp_link"
                                    value={formData.rsvp_link || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/rsvp"
                                    className="full-width-input"
                                />
                            </div>
                        </div>

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
                                    onChange={(e) => {/* Handle file select here */ }}
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
                                {loading ? 'Saving...' : (selectedEvent ? 'Update Event' : 'Create Event')}
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
        status: 'Upcoming',
        event_date: '',
        rsvp_link: ''
    });
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    // New state for search, filtering, sorting and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    // New state for edit mode (modal or full-page)
    const [editMode, setEditMode] = useState('modal'); // 'modal' or 'fullpage'

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

    // Filter and sort events
    const filteredEvents = events
        .filter(event => {
            // Apply status filter
            if (statusFilter !== 'All' && event.status !== statusFilter) {
                return false;
            }

            // Apply search filter to heading and tagline
            if (searchTerm && !event.heading.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !event.tagline?.toLowerCase().includes(searchTerm.toLowerCase())) {
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
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

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

            // Validate event date and status client-side first
            if (formData.event_date) {
                const eventDate = new Date(formData.event_date);
                const today = new Date();

                // If event date is in the past and status is Upcoming, show warning
                if (eventDate < today && formData.status === 'Upcoming') {
                    setError('Cannot set status to Upcoming for past dates. Status will be automatically set to Completed.');
                    // Auto-correct the status to Completed
                    setFormData(prev => ({
                        ...prev,
                        status: 'Completed'
                    }));
                    setLoading(false);
                    return; // Prevent submission until corrected
                }
            }

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

            // Handle specific validation errors from the database
            if (error.message?.includes('Cannot set status to Upcoming for past dates')) {
                setError('Cannot set status to Upcoming for past dates. Please change the status to Completed or Cancelled, or set a future date.');
            } else {
                setError(`Failed to save event: ${error.message || 'Unknown error'}`);
            }
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
            status: event.status,
            event_date: event.event_date ? formatDateForInput(event.event_date) : '',
            rsvp_link: event.rsvp_link || ''
        });
        setEditMode('modal');
        setIsModalOpen(true);
    };

    // Format date for event_date input (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            // Format as YYYY-MM-DDThh:mm (datetime-local format)
            return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                .toISOString()
                .slice(0, 16);
        } catch (e) {
            return '';
        }
    };

    const handleAddNew = () => {
        setSelectedEvent(null);
        setFormData({
            heading: '',
            tagline: '',
            description: '',
            image_url: '',
            status: 'Upcoming',
            event_date: '',
            rsvp_link: ''
        });
        setEditMode('modal');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditMode('modal');
        setSelectedEvent(null);
        setFormData({
            heading: '',
            tagline: '',
            description: '',
            image_url: '',
            status: 'Upcoming',
            event_date: '',
            rsvp_link: ''
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

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    // Switch to full-page editing mode
    const switchToFullPage = () => {
        setEditMode('fullpage');
    };

    const isMobile = window.innerWidth <= 768;

    if (loading && !events.length) {
        return (
            <div className="events-loading">
                <div className="loading-spinner"></div>
                <p>Loading events...</p>
            </div>
        );
    }

    // If in full-page edit mode, render the editor component
    if (editMode === 'fullpage' && isModalOpen) {
        return (
            <EventEditor
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
                selectedEvent={selectedEvent}
                error={error}
            />
        );
    }

    return (
        <div className="events-container">
            <div className="events-header">
                <h1>Events Management</h1>
                <button
                    className="event-add-button"
                    onClick={handleAddNew}
                >
                    Add New Event
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
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
                <div className="filter-controls">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="no-events-message">
                    <p>No events found matching your criteria.</p>
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
                                        className={`sortable-column ${sortField === 'event_date' ? 'active' : ''}`}
                                        onClick={() => handleSort('event_date')}
                                    >
                                        Date {sortField === 'event_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="status-column">Status</th>
                                    <th
                                        className={`sortable-column created-column ${sortField === 'created_at' ? 'active' : ''}`}
                                        onClick={() => handleSort('created_at')}
                                    >
                                        Created {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="actions-column">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEvents.map(event => (
                                    <tr key={event.id} className="event-row">
                                        <td className="image-cell" data-label="Image">
                                            {event.image_url ? (
                                                <div className="thumbnail-container">
                                                    <img
                                                        src={event.image_url}
                                                        alt={event.heading}
                                                        className="event-thumbnail"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="no-image">No image</div>
                                            )}
                                        </td>
                                        <td className="title-cell" data-label="Title">
                                            <div className="event-title">{event.heading}</div>
                                            {event.tagline && <div className="event-subtitle">{event.tagline}</div>}
                                        </td>
                                        <td data-label="Date">{event.event_date ? formatDate(event.event_date) : 'N/A'}</td>
                                        <td data-label="Status">
                                            <span className={`event-status status-${event.status.toLowerCase()}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="created-cell" data-label="Created">{formatDate(event.created_at)}</td>
                                        <td className="actions-cell" data-label="Actions">
                                            <div className="event-action-buttons">
                                                <button
                                                    onClick={() => handleEdit(event)}
                                                    className="event-edit-button"
                                                    title="Edit event"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id)}
                                                    className="event-delete-button"
                                                    title="Delete event"
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

            {/* Updated modal with resize capability and full-page button */}
            {isModalOpen && editMode === 'modal' && (
                <div className="modal-overlay">
                    <div className="modal-content resizable">
                        <div className="modal-header">
                            <h2>{selectedEvent ? 'Edit Event' : 'Add New Event'}</h2>
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
                                <label htmlFor="event_date">Event Date</label>
                                <input
                                    type="datetime-local"
                                    id="event_date"
                                    name="event_date"
                                    value={formData.event_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
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

                            <div className="form-group">
                                <label htmlFor="rsvp_link">RSVP Link (Optional)</label>
                                <input
                                    type="url"
                                    id="rsvp_link"
                                    name="rsvp_link"
                                    value={formData.rsvp_link || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/rsvp"
                                />
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

                        {/* Resize handle */}
                        <div className="resize-handle"></div>
                    </div>
                </div>
            )}
        </div>
    );
} 