import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import './Registrations.css';

export default function Registrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
    const [togglingStatus, setTogglingStatus] = useState(false);

    const getAuthToken = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || '';
    }, []);

    const fetchRegistrations = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const token = await getAuthToken();

            let url = '/api/registrations';
            if (filter !== 'all') {
                url += `?type=${filter}`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch registrations');
            }

            const { data } = await response.json();
            setRegistrations(data || []);
        } catch (err) {
            console.error('Error fetching registrations:', err);
            setError('Failed to load registrations');
        } finally {
            setLoading(false);
        }
    }, [filter, getAuthToken]);

    useEffect(() => {
        fetchRegistrations();
        fetchRegistrationStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchRegistrations]);

    const fetchRegistrationStatus = async () => {
        try {
            const response = await fetch('/api/settings?key=registration_open');
            if (response.ok) {
                const data = await response.json();
                setIsRegistrationOpen(data.value === true || data.value === 'true');
            }
        } catch (err) {
            console.error('Error fetching registration status:', err);
        }
    };

    const toggleRegistrationStatus = async () => {
        try {
            setTogglingStatus(true);
            const token = await getAuthToken();
            const newValue = !isRegistrationOpen;

            const response = await fetch('/api/settings?key=registration_open', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ value: newValue })
            });

            if (response.ok) {
                setIsRegistrationOpen(newValue);
            } else {
                throw new Error('Failed to update setting');
            }
        } catch (err) {
            console.error('Error toggling registration:', err);
            setError('Failed to update registration status');
        } finally {
            setTogglingStatus(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this registration?')) {
            return;
        }

        try {
            const token = await getAuthToken();
            const response = await fetch('/api/admin/supabase-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action: 'delete',
                    table: 'registrations',
                    id
                })
            });

            if (response.ok) {
                setRegistrations(prev => prev.filter(r => r.id !== id));
                if (selectedRegistration?.id === id) {
                    setSelectedRegistration(null);
                }
            }
        } catch (err) {
            console.error('Error deleting registration:', err);
        }
    };

    const exportToCSV = () => {
        const headers = [
            'Type', 'Name', 'Email', 'Student ID', 'Year Level',
            'Primary Dept', 'Secondary Dept', 'CV Link', 'GitHub', 'About', 'Date'
        ];
        const rows = registrations.map(r => [
            r.registration_type,
            r.full_name,
            r.email,
            r.student_id,
            r.year_level,
            r.primary_department || '',
            r.secondary_department || '',
            r.cv_link || '',
            r.github_link || '',
            (r.about_yourself || '').replace(/"/g, '""'),
            new Date(r.created_at).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const memberCount = registrations.filter(r => r.registration_type === 'member').length;
    const coreTeamCount = registrations.filter(r => r.registration_type === 'core_team').length;

    return (
        <div className="registrations-container">
            <div className="registrations-header">
                <h1>Registrations</h1>
                <div className="registrations-toggle-section">
                    <span className="toggle-label">Registration Status:</span>
                    <button
                        className={`status-toggle ${isRegistrationOpen ? 'open' : 'closed'}`}
                        onClick={toggleRegistrationStatus}
                        disabled={togglingStatus}
                    >
                        {togglingStatus ? 'Updating...' : isRegistrationOpen ? 'Open' : 'Closed'}
                    </button>
                </div>
            </div>

            <div className="registrations-stats">
                <div className="stat-badge total">
                    <span className="stat-number">{registrations.length}</span>
                    <span className="stat-label">Total</span>
                </div>
                <div className="stat-badge member">
                    <span className="stat-number">{memberCount}</span>
                    <span className="stat-label">Members</span>
                </div>
                <div className="stat-badge core">
                    <span className="stat-number">{coreTeamCount}</span>
                    <span className="stat-label">Core Team</span>
                </div>
            </div>

            <div className="registrations-controls">
                <div className="filter-tabs">
                    {['all', 'member', 'core_team'].map(f => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'All' : f === 'member' ? 'Members' : 'Core Team'}
                        </button>
                    ))}
                </div>
                <button className="export-btn" onClick={exportToCSV} disabled={registrations.length === 0}>
                    Export CSV
                </button>
            </div>

            {error && <div className="registrations-error">{error}</div>}

            {loading ? (
                <div className="registrations-loading">Loading registrations...</div>
            ) : registrations.length === 0 ? (
                <div className="registrations-empty">
                    <p>No registrations found.</p>
                </div>
            ) : (
                <div className="registrations-table-wrapper">
                    <table className="registrations-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Student ID</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(reg => (
                                <tr key={reg.id}>
                                    <td className="name-cell">{reg.full_name}</td>
                                    <td>{reg.email}</td>
                                    <td>
                                        <span className={`type-badge ${reg.registration_type}`}>
                                            {reg.registration_type === 'core_team' ? 'Core Team' : 'Member'}
                                        </span>
                                    </td>
                                    <td>{reg.student_id}</td>
                                    <td>{formatDate(reg.created_at)}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="action-btn view"
                                            onClick={() => setSelectedRegistration(reg)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDelete(reg.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedRegistration && (
                <div className="modal-overlay" onClick={() => setSelectedRegistration(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Registration Details</h2>
                            <button className="modal-close" onClick={() => setSelectedRegistration(null)}>
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-group">
                                <label>Type</label>
                                <p>
                                    <span className={`type-badge ${selectedRegistration.registration_type}`}>
                                        {selectedRegistration.registration_type === 'core_team' ? 'Core Team' : 'Member'}
                                    </span>
                                </p>
                            </div>
                            <div className="detail-group">
                                <label>Full Name</label>
                                <p>{selectedRegistration.full_name}</p>
                            </div>
                            <div className="detail-group">
                                <label>Email</label>
                                <p>{selectedRegistration.email}</p>
                            </div>
                            <div className="detail-group">
                                <label>Student ID</label>
                                <p>{selectedRegistration.student_id}</p>
                            </div>
                            <div className="detail-group">
                                <label>Year Level</label>
                                <p>{selectedRegistration.year_level}</p>
                            </div>

                            {selectedRegistration.registration_type === 'core_team' && (
                                <>
                                    <div className="detail-divider">Core Team Details</div>
                                    <div className="detail-group">
                                        <label>Primary Department</label>
                                        <p>{selectedRegistration.primary_department}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>Secondary Department</label>
                                        <p>{selectedRegistration.secondary_department}</p>
                                    </div>
                                    <div className="detail-group">
                                        <label>CV Link</label>
                                        <p>
                                            <a href={selectedRegistration.cv_link} target="_blank" rel="noopener noreferrer">
                                                {selectedRegistration.cv_link}
                                            </a>
                                        </p>
                                    </div>
                                    {selectedRegistration.github_link && (
                                        <div className="detail-group">
                                            <label>GitHub</label>
                                            <p>
                                                <a href={selectedRegistration.github_link} target="_blank" rel="noopener noreferrer">
                                                    {selectedRegistration.github_link}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                    <div className="detail-group">
                                        <label>About Themselves</label>
                                        <p className="about-text">{selectedRegistration.about_yourself}</p>
                                    </div>
                                </>
                            )}

                            <div className="detail-group">
                                <label>Submitted</label>
                                <p>{formatDate(selectedRegistration.created_at)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
