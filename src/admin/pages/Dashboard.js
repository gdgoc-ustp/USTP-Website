import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { supabase } from '../../lib/supabase';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalEvents: 0,
        upcomingEvents: 0,
        completedEvents: 0,
        totalPosts: 0,
        totalUsers: 0
    });

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError('');

                // Fetch events count
                const { count: totalEvents, error: eventsError } = await supabase
                    .from('events')
                    .select('*', { count: 'exact' });

                if (eventsError) throw eventsError;

                // Fetch upcoming events count
                const { count: upcomingEvents } = await supabase
                    .from('events')
                    .select('*', { count: 'exact' })
                    .eq('status', 'Upcoming');

                // Fetch completed events count
                const { count: completedEvents } = await supabase
                    .from('events')
                    .select('*', { count: 'exact' })
                    .eq('status', 'Completed');

                // Fetch blog posts count
                const { count: totalPosts, error: postsError } = await supabase
                    .from('blog_posts')
                    .select('*', { count: 'exact' });

                if (postsError) throw postsError;

                // Fetch users count
                const { count: totalUsers, error: usersError } = await supabase
                    .from('users')
                    .select('*', { count: 'exact' });

                if (usersError) throw usersError;

                setStats({
                    totalEvents: totalEvents || 0,
                    upcomingEvents: upcomingEvents || 0,
                    completedEvents: completedEvents || 0,
                    totalPosts: totalPosts || 0,
                    totalUsers: totalUsers || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Event Status Distribution Chart
    const eventStatusData = {
        labels: ['Upcoming', 'Completed', 'Cancelled'],
        datasets: [{
            data: [
                stats.upcomingEvents,
                stats.completedEvents,
                stats.totalEvents - (stats.upcomingEvents + stats.completedEvents)
            ],
            backgroundColor: [
                'rgba(66, 133, 244, 0.8)',
                'rgba(52, 168, 83, 0.8)',
                'rgba(234, 67, 53, 0.8)'
            ],
            borderColor: [
                'rgba(66, 133, 244, 1)',
                'rgba(52, 168, 83, 1)',
                'rgba(234, 67, 53, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Content Distribution Chart
    const contentDistributionData = {
        labels: ['Events', 'Blog Posts', 'Users'],
        datasets: [{
            label: 'Total Count',
            data: [stats.totalEvents, stats.totalPosts, stats.totalUsers],
            backgroundColor: [
                'rgba(66, 133, 244, 0.5)',
                'rgba(251, 188, 5, 0.5)',
                'rgba(52, 168, 83, 0.5)'
            ],
            borderColor: [
                'rgba(66, 133, 244, 1)',
                'rgba(251, 188, 5, 1)',
                'rgba(52, 168, 83, 1)'
            ],
            borderWidth: 1
        }]
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                {error}
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Events</h3>
                    <p>{stats.totalEvents}</p>
                </div>
                <div className="stat-card">
                    <h3>Upcoming Events</h3>
                    <p>{stats.upcomingEvents}</p>
                </div>
                <div className="stat-card">
                    <h3>Blog Posts</h3>
                    <p>{stats.totalPosts}</p>
                </div>
                <div className="stat-card">
                    <h3>Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-container">
                    <h2>Event Status Distribution</h2>
                    <div className="chart-wrapper">
                        <Doughnut 
                            data={eventStatusData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Content Distribution</h2>
                    <div className="chart-wrapper">
                        <Bar
                            data={contentDistributionData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 