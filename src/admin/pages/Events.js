import React, { useState, useEffect } from 'react';
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
                            <p className="event-description">{event.description}</p>
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
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="image_url">Image URL</label>
                                <input
                                    type="url"
                                    id="image_url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
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