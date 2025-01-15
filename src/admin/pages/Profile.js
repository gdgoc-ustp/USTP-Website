import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './Profile.css';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        permission: 'VIEWER'
    });

    useEffect(() => {
        fetchProfile();
        if (user?.permission === 'SYSTEM') {
            fetchUsers();
        }
    }, [user?.permission]);

    const fetchProfile = async () => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            setUser({ ...user, ...profile });
            setFormData(prev => ({
                ...prev,
                email: user.email,
                name: profile.name || ''
            }));
        } catch (error) {
            setError('Failed to fetch profile');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: formData.newPassword
            });

            if (error) throw error;

            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            alert('Password updated successfully');
        } catch (error) {
            setError('Failed to update password');
            console.error('Error:', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    name: formData.name,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;
            await fetchProfile();
            alert('Profile updated successfully');
        } catch (error) {
            setError('Failed to update profile');
            console.error('Error:', error);
        }
    };

    const handleUserEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            name: user.name || '',
            permission: user.permission,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowModal(true);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setFormData({
            email: '',
            name: '',
            permission: 'VIEWER',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowModal(true);
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (selectedUser) {
                // Update existing user
                const { error } = await supabase
                    .from('users')
                    .update({
                        name: formData.name,
                        permission: formData.permission,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', selectedUser.id);

                if (error) throw error;
            } else {
                // Create new user
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.newPassword || generateTemporaryPassword()
                });

                if (signUpError) throw signUpError;

                const { error: profileError } = await supabase
                    .from('users')
                    .insert([{
                        id: data.user.id,
                        email: formData.email,
                        name: formData.name,
                        permission: formData.permission,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }]);

                if (profileError) throw profileError;
            }

            await fetchUsers();
            setShowModal(false);
            setSelectedUser(null);
            setFormData({
                email: '',
                name: '',
                permission: 'VIEWER',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setError(selectedUser ? 'Failed to update user' : 'Failed to create user');
            console.error('Error:', error);
        }
    };

    const handleUserDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            await fetchUsers();
        } catch (error) {
            setError('Failed to delete user');
            console.error('Error:', error);
        }
    };

    // Helper function to generate a temporary password
    const generateTemporaryPassword = () => {
        return Math.random().toString(36).slice(-8);
    };

    if (loading) return <div className="admin-loading">Loading profile...</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profile Settings</h1>
            </div>

            {error && <div className="admin-error-message">{error}</div>}

            <div className="profile-content">
                <div className="profile-section">
                    <h2>Account Information</h2>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="info-group">
                            <label>Email</label>
                            <p>{user?.email}</p>
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="info-group">
                            <label>Permission Level</label>
                            <p>{user?.permission}</p>
                        </div>
                        <div className="info-group">
                            <label>Account Created</label>
                            <p>{new Date(user?.created_at).toLocaleDateString()}</p>
                        </div>
                        <button type="submit" className="update-button">
                            Update Profile
                        </button>
                    </form>
                </div>

                <div className="profile-section">
                    <h2>Change Password</h2>
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                minLength={6}
                            />
                        </div>
                        <button type="submit" className="update-button">
                            Update Password
                        </button>
                    </form>
                </div>

                {user?.permission === 'SYSTEM' && (
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>User Management</h2>
                            <button onClick={handleAddUser} className="add-user-button">
                                Add New User
                            </button>
                        </div>
                        <div className="users-grid">
                            {users.map(u => (
                                <div key={u.id} className="user-card">
                                    <div className="user-content">
                                        <h3>{u.name || u.email}</h3>
                                        <p className="user-email">{u.email}</p>
                                        <p className="user-permission">{u.permission}</p>
                                        <div className="user-metadata">
                                            <div className="user-dates">
                                                <span>Created: {new Date(u.created_at).toLocaleDateString()}</span>
                                                <span>Updated: {new Date(u.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="user-actions">
                                            <button onClick={() => handleUserEdit(u)}>Edit</button>
                                            {u.id !== user.id && (
                                                <button onClick={() => handleUserDelete(u.id)}>Delete</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{selectedUser ? 'Edit User' : 'Add New User'}</h2>
                        <form onSubmit={handleUserUpdate}>
                            <div className="form-group">
                                <label>Email</label>
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
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            {!selectedUser && (
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        placeholder="Leave blank for auto-generated password"
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Permission Level</label>
                                <select
                                    name="permission"
                                    value={formData.permission}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="VIEWER">Viewer</option>
                                    <option value="EDITOR">Editor</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="SYSTEM">System</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit">{selectedUser ? 'Update' : 'Create'}</button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile; 