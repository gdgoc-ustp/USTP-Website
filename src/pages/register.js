import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavigationBar from "../components/navBar";
import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import "./register.css";

const DEPARTMENTS = [
  'Operations',
  'Technology',
  'Communications',
  'Community Development'
];

const YEAR_LEVELS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Graduate',
  'Other'
];

export default function Register() {
  const location = useLocation();
  const [registrationType, setRegistrationType] = useState('member');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    student_id: '',
    year_level: '',
    primary_department: '',
    secondary_department: '',
    cv_link: '',
    github_link: '',
    about_yourself: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch('/api/settings?key=registration_open');
      if (response.ok) {
        const data = await response.json();
        setIsRegistrationOpen(data.value === true || data.value === 'true');
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const payload = {
        registration_type: registrationType,
        full_name: formData.full_name,
        email: formData.email,
        student_id: formData.student_id,
        year_level: formData.year_level
      };

      if (registrationType === 'core_team') {
        payload.primary_department = formData.primary_department;
        payload.secondary_department = formData.secondary_department;
        payload.cv_link = formData.cv_link;
        payload.github_link = formData.github_link || null;
        payload.about_yourself = formData.about_yourself;
      }

      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Registration submitted successfully! We\'ll be in touch soon.'
        });
        setFormData({
          full_name: '',
          email: '',
          student_id: '',
          year_level: '',
          primary_department: '',
          secondary_department: '',
          cv_link: '',
          github_link: '',
          about_yourself: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Failed to submit registration' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div id="overhaul-v2-root">
        <NavigationBar />
        <div className="register-loading">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div id="overhaul-v2-root">
      <NavigationBar />

      <HeroSection
        title="Registration"
        theme="events"
        previousPath={location.state?.from}
      />

      <main className="register-page-container">
        {!isRegistrationOpen ? (
          <div className="register-closed">
            <div className="register-closed-card">
              <img src="/devy-2.png" alt="Registration Closed" className="register-closed-image" />
              <h2>Registration Closed</h2>
              <p>
                Registration is currently closed. Please check back later or follow our
                social media for announcements about the next registration period.
              </p>
            </div>
          </div>
        ) : (
          <div className="register-card">
            <h1 className="register-title">Join GDG on Campus USTP</h1>
            <p className="register-subtitle">
              Be part of our growing community of developers and tech enthusiasts!
            </p>

            <div className="register-tabs">
              <button
                type="button"
                className={`register-tab ${registrationType === 'member' ? 'active' : ''}`}
                onClick={() => setRegistrationType('member')}
              >
                Member
              </button>
              <button
                type="button"
                className={`register-tab ${registrationType === 'core_team' ? 'active' : ''}`}
                onClick={() => setRegistrationType('core_team')}
              >
                Core Team
              </button>
            </div>

            <p className="register-tab-description">
              {registrationType === 'member'
                ? 'Join as a member to attend events, workshops, and connect with fellow developers.'
                : 'Apply to be part of the core team and help shape our community\'s future.'}
            </p>

            {submitStatus.message && (
              <div className={`register-status ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="full_name">Full Name *</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="student_id">Student ID *</label>
                <input
                  id="student_id"
                  name="student_id"
                  type="text"
                  placeholder="Enter your student ID"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="year_level">Year Level *</label>
                <select
                  id="year_level"
                  name="year_level"
                  value={formData.year_level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select year level</option>
                  {YEAR_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {registrationType === 'core_team' && (
                <>
                  <div className="form-divider">
                    <span>Core Team Application</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="primary_department">Preferred Department *</label>
                    <select
                      id="primary_department"
                      name="primary_department"
                      value={formData.primary_department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="secondary_department">Secondary Preferred Department *</label>
                    <select
                      id="secondary_department"
                      name="secondary_department"
                      value={formData.secondary_department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cv_link">CV/Resume Link *</label>
                    <input
                      id="cv_link"
                      name="cv_link"
                      type="url"
                      placeholder="https://drive.google.com/your-cv"
                      value={formData.cv_link}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="form-hint">Google Drive, Dropbox, or any accessible link</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="github_link">GitHub Profile (Optional)</label>
                    <input
                      id="github_link"
                      name="github_link"
                      type="url"
                      placeholder="https://github.com/yourusername"
                      value={formData.github_link}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="about_yourself">Tell Us About Yourself *</label>
                    <textarea
                      id="about_yourself"
                      name="about_yourself"
                      placeholder="Share your background, skills, and why you want to join the core team..."
                      value={formData.about_yourself}
                      onChange={handleInputChange}
                      rows={5}
                      required
                    />
                  </div>
                </>
              )}

              <div className="register-privacy">
                <p>
                  By submitting this form, you agree to our{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                  . We collect and store the information you provide to manage
                  registrations and communicate with you about GDG events and updates.
                </p>
              </div>

              <button
                type="submit"
                className="register-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
