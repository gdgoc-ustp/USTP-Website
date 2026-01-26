import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Logo from '../../assets/logo.png';
import './Setup.css';

export default function Setup() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        position: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check if setup is already completed
    useEffect(() => {
        const checkSetup = async () => {
            try {
                console.log('Checking if setup is already completed...');
                const { count, error } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true });

                console.log('Users count:', count);

                if (error) {
                    console.error('Error checking users:', error);
                    setError('Error checking setup status');
                    return;
                }

                if (count > 0) {
                    console.log('Setup already completed, redirecting to login...');
                    navigate('/admin/login');
                }
            } catch (error) {
                console.error('Error during setup check:', error);
                setError('Error checking setup status');
            } finally {
                setLoading(false);
            }
        };

        checkSetup();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
    };

    const validateStep = () => {
        if (step === 1) {
            if (!formData.email || !formData.password || !formData.confirmPassword) {
                setError('All fields are required');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return false;
            }
        } else if (step === 2) {
            if (!formData.name || !formData.position) {
                setError('Name and position are required');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setError('');
        setStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        try {
            setError('');
            setLoading(true);
            console.log('Creating system admin account...');

            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        position: formData.position,
                        address: formData.address,
                        permission: 'SYSTEM'
                    }
                }
            });

            if (authError) {
                console.error('Auth error:', authError);
                throw authError;
            }

            console.log('Auth account created:', authData);

            // Create user profile with SYSTEM permission
            const { error: profileError } = await supabase
                .from('users')
                .insert([{
                    id: authData.user.id,
                    name: formData.name,
                    email: formData.email,
                    position: formData.position,
                    address: formData.address,
                    permission: 'SYSTEM',
                    password: '' // We don't store the actual password
                }]);

            if (profileError) {
                console.error('Profile error:', profileError);
                throw profileError;
            }

            console.log('System admin profile created');

            // Show success message and redirect
            alert('Setup completed! Please check your email to verify your account before logging in.');
            navigate('/admin/login');
        } catch (error) {
            console.error('Setup error:', error);
            setError('Failed to create account: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="setup-container">
                <div className="setup-card">
                    <img src={Logo} alt="Logo" className="setup-logo" />
                    <div className="setup-message">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="setup-container">
            <div className="setup-card">
                <img src={Logo} alt="Logo" className="setup-logo" />
                <h2 className="setup-title">System Setup</h2>
                <div className="setup-progress">
                    <div className={`setup-step ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className="setup-line"></div>
                    <div className={`setup-step ${step >= 2 ? 'active' : ''}`}>2</div>
                </div>

                {error && (
                    <div className="setup-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="setup-form">
                    {step === 1 && (
                        <div className="setup-step-content">
                            <h2>Create Admin Account</h2>
                            <div className="setup-form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="setup-input"
                                    required
                                />
                            </div>
                            <div className="setup-form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="setup-input"
                                    required
                                />
                            </div>
                            <div className="setup-form-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="setup-input"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="setup-step-content">
                            <h2>Personal Information</h2>
                            <div className="setup-form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="setup-input"
                                    required
                                />
                            </div>
                            <div className="setup-form-group">
                                <input
                                    type="text"
                                    name="position"
                                    placeholder="Position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className="setup-input"
                                    required
                                />
                            </div>
                            <div className="setup-form-group">
                                <textarea
                                    name="address"
                                    placeholder="Address (Optional)"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="setup-input setup-textarea"
                                />
                            </div>
                        </div>
                    )}

                    <div className="setup-buttons">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="setup-button setup-button-secondary"
                                disabled={loading}
                            >
                                Back
                            </button>
                        )}
                        {step < 2 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="setup-button"
                                disabled={loading}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="setup-button"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Complete Setup'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
} 