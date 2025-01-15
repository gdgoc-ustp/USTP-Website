import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        permission: 'VIEWER'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data);
        } catch (error) {
            setError('Failed to fetch users');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (selectedUser) {
                const { error } = await supabase
                    .from('users')
                    .update({
                        permission: formData.permission,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', selectedUser.id);

                if (error) throw error;
            } else {
                // For new users, we'll need to use Supabase Auth to create the account
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: generateTemporaryPassword() // You might want to generate this or ask for it
                });

                if (signUpError) throw signUpError;

                // Create the user profile with permissions
                const { error: profileError } = await supabase
                    .from('users')
                    .insert([{
                        id: data.user.id,
                        email: formData.email,
                        permission: formData.permission,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }]);

                if (profileError) throw profileError;
            }

            await fetchUsers();
            handleCloseModal();
        } catch (error) {
            setError('Failed to save user');
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const { error } = await supabase
                    .from('users')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                await fetchUsers();
            } catch (error) {
                setError('Failed to delete user');
                console.error('Error:', error);
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            permission: user.permission
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setFormData({
            email: '',
            permission: 'VIEWER'
        });
        setError(null);
    };

    // Helper function to generate a temporary password
    const generateTemporaryPassword = () => {
        return Math.random().toString(36).slice(-8);
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

    if (loading) return <div className="admin-loading">Loading users...</div>;

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>Users Management</h1>
                <button onClick={() => setShowModal(true)} className="add-user-button">
                    Add New User
                </button>
            </div>

            {error && <div className="admin-error-message">{error}</div>}

            <div className="users-grid">
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <div className="user-content">
                            <h3>{user.email}</h3>
                            <p className="user-permission">{user.permission}</p>
                            <div className="user-metadata">
                                <div className="user-dates">
                                    <span>Created: {formatDate(user.created_at)}</span>
                                    <span>Updated: {formatDate(user.updated_at)}</span>
                                </div>
                            </div>
                            <div className="user-actions">
                                <button onClick={() => handleEdit(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedUser ? 'Edit User' : 'Add New User'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    disabled={selectedUser}
                                />
                            </div>

                            <div className="form-group">
                                <label>Permission:</label>
                                <select
                                    name="permission"
                                    value={formData.permission}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="VIEWER">Viewer</option>
                                    <option value="EDITOR">Editor</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="submit">{selectedUser ? 'Update' : 'Create'}</button>
                                <button type="button" onClick={handleCloseModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users; 