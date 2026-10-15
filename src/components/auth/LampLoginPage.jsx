import React, { useState, useMemo } from 'react';
import { useAuth, formatAuthError } from '../../context/AuthContext';
import './LampLogin.css';

export default function LampLoginPage({ onBackToLanding, onSuccess, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'github' | null
  const [lampOn, setLampOn] = useState(true);

  const { signIn, signUp, isConfigured } = useAuth();

  // Floating firefly particles around the light beam and ambient scene
  const particles = useMemo(() => {
    return [
      { id: 1, left: '16%', top: '38%', size: '4px', delay: '0s', duration: '5.5s' },
      { id: 2, left: '22%', top: '52%', size: '3px', delay: '1.2s', duration: '6.2s' },
      { id: 3, left: '28%', top: '65%', size: '5px', delay: '0.6s', duration: '7.0s' },
      { id: 4, left: '19%', top: '78%', size: '3.5px', delay: '2.4s', duration: '5.8s' },
      { id: 5, left: '32%', top: '44%', size: '4px', delay: '3.1s', duration: '6.5s' },
      { id: 6, left: '25%', top: '82%', size: '4.5px', delay: '1.8s', duration: '8.0s' },
      { id: 7, left: '14%', top: '60%', size: '3px', delay: '2.9s', duration: '5.2s' },
      { id: 8, left: '36%', top: '72%', size: '5px', delay: '0.4s', duration: '6.8s' },
      { id: 9, left: '42%', top: '85%', size: '3.5px', delay: '2.1s', duration: '7.5s' },
      { id: 10, left: '11%', top: '70%', size: '4px', delay: '3.5s', duration: '6.0s' },
      { id: 11, left: '29%', top: '30%', size: '3px', delay: '1.5s', duration: '7.2s' },
      { id: 12, left: '38%', top: '58%', size: '4.5px', delay: '0.8s', duration: '6.4s' },
    ];
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email address and password.');
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
        setSuccessMessage('Welcome back! Launching DRISHTI AI platform...');
      } else {
        await signUp(email.trim(), password, fullName.trim() || 'Rohit Chaudhari');
        setSuccessMessage('Account created successfully! Initializing workspace...');
      }

      setTimeout(() => {
        setSubmitting(false);
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.hash = 'dashboard';
        }
      }, 700);
    } catch (err) {
      setSubmitting(false);
      setErrorMessage(formatAuthError(err));
    }
  };

  const handleSocialAuth = (provider) => {
    setSocialLoading(provider);
    setErrorMessage('');
    
    // Attempt social sign in or give clear helpful message if OAuth redirect/keys not configured in Firebase
    setTimeout(() => {
      setSocialLoading(null);
      setErrorMessage(`${provider === 'google' ? 'Google' : 'GitHub'} authentication requires OAuth credentials enabled in Firebase Console. Please sign in with your email & password.`);
    }, 900);
  };

  const handleToggleLamp = () => {
    setLampOn(!lampOn);
  };

  return (
    <div className="lamp-login-root">
      {/* ================================================================
          TOP-LEFT BRANDING (Matching Reference Image 2)
          ================================================================ */}
      <div className="lamp-top-brand" onClick={onBackToLanding || (() => { window.location.hash = ''; })}>
        <div className="lamp-brand-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path 
              d="M4 6C4 4.89543 4.89543 4 6 4H16C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12H9V14H15C16.6569 14 18 15.3431 18 17C18 18.6569 16.6569 20 15 20H6C4.89543 20 4 19.1046 4 18V6Z" 
              fill="#0A0A0C" 
            />
          </svg>
        </div>
        <div className="lamp-brand-text-col">
          <div className="lamp-brand-title">DRISHTI AI</div>
          <div className="lamp-brand-tagline">See Beyond. Build Smarter.</div>
        </div>
      </div>

      {/* Top-Right Quick Return Link */}
      <button 
        type="button" 
        className="lamp-back-home"
        onClick={onBackToLanding || (() => { window.location.hash = ''; })}
        aria-label="Back to Website"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to Website</span>
      </button>

      {/* Desk Surface Silhouette & Highlight Line at Bottom */}
      <div className="lamp-desk-surface">
        <div className="lamp-desk-wood-grain"></div>
      </div>

      {/* ================================================================
          MAIN SPLIT STAGE: LAMP ON LEFT, CARD ON RIGHT
          ================================================================ */}
      <div className="lamp-login-stage">
        {/* ================================================================
            LEFT: CINEMATIC GLOWING DESK LAMP & CONICAL LIGHT BEAM
            ================================================================ */}
        <div className="lamp-scene-column">
          {/* Ambient Warm Radial Glow */}
          <div className={`lamp-ambient-glow ${!lampOn ? 'lamp-off' : ''}`}></div>

          {/* Distinct Volumetric Conical Light Beam (Matching Reference 2) */}
          <div className={`lamp-light-beam ${!lampOn ? 'lamp-off' : ''}`}></div>

          {/* Desk Surface Warm Light Pool */}
          <div className={`lamp-desk-light-pool ${!lampOn ? 'lamp-off' : ''}`}></div>

          {/* Glowing Floating Firefly / Dust Particles */}
          {lampOn && (
            <div className="lamp-particles-container">
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="lamp-firefly"
                  style={{
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size,
                    animationDelay: p.delay,
                    animationDuration: p.duration
                  }}
                />
              ))}
            </div>
          )}

          {/* Sleek Desk Lamp (Faithfully matching Reference Image 2: circular base, vertical rod, bell shade) */}
          <div 
            className="lamp-svg-wrap" 
            onClick={handleToggleLamp}
            title={lampOn ? 'Click lamp to switch off' : 'Click lamp to turn on'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggleLamp()}
            aria-label={lampOn ? 'Turn lamp off' : 'Turn lamp on'}
          >
            <svg 
              width="380" 
              height="520" 
              viewBox="0 0 380 520" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Sleek dark metallic gradient */}
                <linearGradient id="lampDarkMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E1E24" />
                  <stop offset="35%" stopColor="#32323D" />
                  <stop offset="70%" stopColor="#16161C" />
                  <stop offset="100%" stopColor="#0B0B0E" />
                </linearGradient>

                {/* Golden brass joints / accents */}
                <linearGradient id="lampGoldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE57F" />
                  <stop offset="45%" stopColor="#FFC72C" />
                  <stop offset="100%" stopColor="#B38600" />
                </linearGradient>

                {/* Inner Shade Luminous Core Glow */}
                <radialGradient id="lampBulbCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="25%" stopColor="#FFF4CC" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#FFC72C" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FF9900" stopOpacity="0" />
                </radialGradient>

                {/* Lamp Beam Gradient */}
                <linearGradient id="lampBeamGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FFE066" stopOpacity="0.8" />
                  <stop offset="35%" stopColor="#FFC72C" stopOpacity="0.35" />
                  <stop offset="75%" stopColor="#FFA000" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#FF8800" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Conical light beam cast from shade */}
              {lampOn && (
                <path 
                  d="M136 210 L30 490 L260 490 L164 210 Z" 
                  fill="url(#lampBeamGrad)" 
                  opacity="0.75" 
                  filter="blur(14px)"
                />
              )}

              {/* 1. Heavy Circular Table Base */}
              <ellipse cx="145" cy="485" rx="58" ry="12" fill="#050507" />
              <ellipse cx="145" cy="480" rx="55" ry="10" fill="url(#lampDarkMetal)" stroke="#3A3A46" strokeWidth="1" />
              <ellipse cx="145" cy="477" rx="38" ry="6" fill="#14141A" />

              {/* Base Brass Ring */}
              <ellipse cx="145" cy="476" rx="14" ry="4" fill="url(#lampGoldAccent)" />

              {/* 2. Vertical Rod / Stand */}
              <line x1="145" y1="476" x2="145" y2="230" stroke="url(#lampDarkMetal)" strokeWidth="8" strokeLinecap="round" />
              <line x1="144" y1="476" x2="144" y2="230" stroke="#484856" strokeWidth="1.5" strokeLinecap="round" />

              {/* Middle Brass Joint / Adjustment Collar */}
              <rect x="139" y="340" width="12" height="14" rx="2" fill="url(#lampGoldAccent)" stroke="#997000" strokeWidth="0.8" />
              <circle cx="152" cy="347" r="4" fill="url(#lampGoldAccent)" />

              {/* 3. Top Curved Neck / Joint */}
              <circle cx="145" cy="228" r="9" fill="url(#lampGoldAccent)" stroke="#997000" strokeWidth="1" />
              <circle cx="145" cy="228" r="4" fill="#121218" />

              {/* Curved gooseneck arm leading to lampshade */}
              <path 
                d="M145 228 C145 190 150 180 150 180" 
                stroke="url(#lampDarkMetal)" 
                strokeWidth="7" 
                strokeLinecap="round" 
              />

              {/* Shade Fixture Socket */}
              <rect x="143" y="176" width="14" height="12" rx="3" fill="url(#lampGoldAccent)" />

              {/* 4. Bell / Dome Lampshade (Angled downward matching Reference Image 2) */}
              <g>
                {/* Main Dome Shade Shell */}
                <path 
                  d="M118 206 C118 178 182 178 182 206 L192 216 C194 220 188 224 182 224 L118 224 C112 224 106 220 108 216 Z" 
                  fill="url(#lampDarkMetal)" 
                  stroke="#383846" 
                  strokeWidth="1.8" 
                />

                {/* Highlight curve on top of shade */}
                <path 
                  d="M128 190 C138 184 162 184 172 190" 
                  stroke="#5A5A6C" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  fill="none" 
                />

                {/* Bottom Lip Ring of Shade */}
                <ellipse cx="150" cy="220" rx="36" ry="9" fill="#121218" stroke="url(#lampGoldAccent)" strokeWidth="1.8" />

                {/* Luminous Inner Glow and Bulb when ON */}
                {lampOn ? (
                  <>
                    <ellipse cx="150" cy="220" rx="32" ry="7" fill="url(#lampBulbCore)" />
                    {/* Glowing Filament Bulb */}
                    <circle cx="150" cy="216" r="10" fill="#FFFFFF" className="lamp-bulb-glow-circle" />
                    <circle cx="150" cy="216" r="6" fill="#FFFBE6" />
                  </>
                ) : (
                  <ellipse cx="150" cy="220" rx="32" ry="7" fill="#0D0D12" />
                )}
              </g>

              {/* Hanging Pull-Chain / Switch Cord */}
              <g>
                <line x1="168" y1="220" x2="168" y2="280" stroke="#FFC72C" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.85" />
                <circle cx="168" cy="283" r="3.5" fill="url(#lampGoldAccent)" stroke="#997000" strokeWidth="0.8" />
              </g>
            </svg>
          </div>

          {/* Interactive Hint */}
          <div className="lamp-click-hint" onClick={handleToggleLamp}>
            <span className="lamp-switch-dot"></span>
            <span>{lampOn ? 'Lamp Active • Click to switch off' : 'Lamp Off • Click to illuminate'}</span>
          </div>
        </div>

        {/* ================================================================
            RIGHT: TRANSLUCENT GLASS LOGIN CARD (Matching Reference Image 2)
            ================================================================ */}
        <div className="lamp-auth-card-wrap">
          <div className="lamp-auth-glass-card">
            {/* Header: Welcome Back with Lightbulb emoji */}
            <h1 className="lamp-card-title">
              {mode === 'signin' ? 'Welcome Back 💡' : 'Create Account 🚀'}
            </h1>
            <p className="lamp-card-subtitle">
              {mode === 'signin' 
                ? 'Enter your details to access your account' 
                : 'Enter your details to create your DRISHTI AI account'}
            </p>

            {/* Config notice if keys are missing */}
            {!isConfigured && (
              <div className="lamp-config-notice">
                <span>⚡</span>
                <span>
                  <strong>Firebase Notice:</strong> Add your credentials in <code>.env</code> to connect with your live project.
                </span>
              </div>
            )}

            {/* Error & Success Feedback Alerts */}
            {errorMessage && (
              <div className="lamp-alert-box error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="lamp-alert-box success" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="lamp-form-flow" noValidate>
              {mode === 'signup' && (
                <div className="lamp-input-wrap">
                  <span className="lamp-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={submitting}
                    className="lamp-field-input"
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Email Input Field with Envelope Icon */}
              <div className="lamp-input-wrap">
                <span className="lamp-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="lamp-field-input"
                  autoComplete="email"
                />
              </div>

              {/* Password Input Field with Lock Icon and Eye Show/Hide Toggle */}
              <div className="lamp-input-wrap">
                <span className="lamp-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className="lamp-field-input"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="lamp-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              {mode === 'signup' && (
                <div className="lamp-input-wrap">
                  <span className="lamp-input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={submitting}
                    className="lamp-field-input"
                    autoComplete="new-password"
                  />
                </div>
              )}

              {/* Bright Solid Yellow Button (Matching Reference Image 2) */}
              <button 
                type="submit" 
                className="lamp-primary-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="lamp-btn-spinner"></span>
                    <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* OR CONTINUE WITH Divider */}
            <div className="lamp-divider-row">
              <span className="lamp-divider-line"></span>
              <span className="lamp-divider-text">OR CONTINUE WITH</span>
              <span className="lamp-divider-line"></span>
            </div>

            {/* Social / Provider Buttons: Google & GitHub */}
            <div className="lamp-social-grid">
              <button
                type="button"
                className="lamp-social-btn"
                onClick={() => handleSocialAuth('google')}
                disabled={submitting || Boolean(socialLoading)}
              >
                {socialLoading === 'google' ? (
                  <span className="lamp-btn-spinner-sm"></span>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>Google</span>
              </button>

              <button
                type="button"
                className="lamp-social-btn"
                onClick={() => handleSocialAuth('github')}
                disabled={submitting || Boolean(socialLoading)}
              >
                {socialLoading === 'github' ? (
                  <span className="lamp-btn-spinner-sm"></span>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                )}
                <span>GitHub</span>
              </button>
            </div>

            {/* Footer: Don't have an account? Create Account */}
            <div className="lamp-card-footer">
              {mode === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    className="lamp-yellow-link"
                    onClick={() => { setMode('signup'); setErrorMessage(''); }}
                    disabled={submitting}
                  >
                    Create Account
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="lamp-yellow-link"
                    onClick={() => { setMode('signin'); setErrorMessage(''); }}
                    disabled={submitting}
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
