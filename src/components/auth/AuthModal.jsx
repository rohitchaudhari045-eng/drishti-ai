import React, { useState, useEffect } from 'react';
import { useAuth, formatAuthError } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signIn, signUp, isConfigured } = useAuth();

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
    }

    setSubmitting(true);

    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
        setSuccessMessage('Successfully signed in!');
      } else {
        await signUp(email.trim(), password, fullName.trim());
        setSuccessMessage('Account created successfully!');
      }

      setTimeout(() => {
        setSubmitting(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 600);
    } catch (err) {
      setSubmitting(false);
      setErrorMessage(formatAuthError(err));
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={() => !submitting && onClose()}>
      <div 
        className="auth-modal-container" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-modal-brand">
            <div className="brand-icon" style={{ width: '28px', height: '28px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="auth-modal-brand-title">DRISHTI <span className="brand-accent">AI</span></span>
          </div>
          <button 
            type="button" 
            className="auth-modal-close-btn" 
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Configuration Notice if .env variables are missing */}
        {!isConfigured && (
          <div className="auth-banner-notice">
            <div className="auth-notice-icon">⚙️</div>
            <div className="auth-notice-text">
              <strong>Firebase Setup Note:</strong> Place your Firebase keys in a <code>.env</code> file to enable live authentication with your Firebase project.
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="auth-tab-switch">
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => { setMode('signin'); setErrorMessage(''); setSuccessMessage(''); }}
            disabled={submitting}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
            disabled={submitting}
          >
            Create Account
          </button>
        </div>

        <h3 id="auth-modal-title" className="auth-modal-heading">
          {mode === 'signin' ? 'Welcome back to DRISHTI AI' : 'Start with DRISHTI AI Platform'}
        </h3>
        <p className="auth-modal-subheading">
          {mode === 'signin' 
            ? 'Access your unified agent intelligence and workflow control plane' 
            : 'Register your developer account to deploy and monitor autonomous AI agents'}
        </p>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="auth-alert-box error" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert-box success" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          {mode === 'signup' && (
            <div className="auth-field-group">
              <label htmlFor="auth-fullname" className="auth-field-label">Full Name</label>
              <div className="auth-input-wrapper">
                <input
                  id="auth-fullname"
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={submitting}
                  className="auth-text-input"
                />
              </div>
            </div>
          )}

          <div className="auth-field-group">
            <label htmlFor="auth-email" className="auth-field-label">Email Address *</label>
            <div className="auth-input-wrapper">
              <input
                id="auth-email"
                type="email"
                required
                placeholder="developer@enterprise.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="auth-text-input"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field-group">
            <div className="auth-field-label-row">
              <label htmlFor="auth-password" className="auth-field-label">Password *</label>
              <button 
                type="button" 
                className="auth-toggle-pwd" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="auth-input-wrapper">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="auth-text-input"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="auth-field-group">
              <label htmlFor="auth-confirm-password" className="auth-field-label">Confirm Password *</label>
              <div className="auth-input-wrapper">
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={submitting}
                  className="auth-text-input"
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary auth-submit-btn" 
            disabled={submitting}
          >
            {submitting ? (
              <span className="auth-btn-spinner-content">
                <span className="auth-spinner-ring"></span>
                <span>{mode === 'signin' ? 'Authenticating...' : 'Creating Account...'}</span>
              </span>
            ) : (
              <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
            )}
          </button>
        </form>

        <div className="auth-modal-footer">
          {mode === 'signin' ? (
            <p className="auth-switch-prompt">
              Don't have an account yet?{' '}
              <button 
                type="button" 
                className="auth-inline-link"
                onClick={() => { setMode('signup'); setErrorMessage(''); }}
                disabled={submitting}
              >
                Create one now
              </button>
            </p>
          ) : (
            <p className="auth-switch-prompt">
              Already have an account?{' '}
              <button 
                type="button" 
                className="auth-inline-link"
                onClick={() => { setMode('signin'); setErrorMessage(''); }}
                disabled={submitting}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
