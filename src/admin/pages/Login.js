import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { checkFirstTimeSetup } from '../../lib/supabase';
import Logo from '../../assets/logo.png';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { signIn, user } = useAuth();

    // Check for first-time setup on component mount
    useEffect(() => {
        const checkSetup = async () => {
            try {
                console.log('Checking first-time setup...');
                const { isFirstTime, error } = await checkFirstTimeSetup();
                console.log('Setup check result:', { isFirstTime, error });

                if (error) {
                    console.error('Error checking setup:', error);
                    return;
                }

                if (isFirstTime) {
                    console.log('Redirecting to setup...');
                    navigate('/admin/setup');
                    return;
                }

                console.log('Not first time setup, staying on login page');
            } catch (error) {
                console.error('Error during setup check:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSetup();
    }, [navigate]);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const { data, error } = await signIn(email, password);
            if (error) throw error;
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError('Failed to sign in: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-login-container">
                <div className="admin-loading">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <img src={Logo} alt="Logo" className="admin-logo" />
                <h2 className="admin-title">Admin Login</h2>

                {error && (
                    <div className="admin-error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="admin-input"
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="admin-input"
                            required
                        />
                    </div>

                    <div className="admin-remember-me">
                        <label className="admin-checkbox-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="admin-checkbox"
                            />
                            <span>Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="admin-login-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
} 