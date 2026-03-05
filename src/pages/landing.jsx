import { useState, useRef, useEffect, useCallback } from "react";
import { PageShell, Brand, Card, Btn, Input, Modal, OtpInput, Spinner } from "../components";

const GOOGLE_CLIENT_ID =
  "828442976315-29947njoflscn4u45rn6en4upa48aa52.apps.googleusercontent.com";

// ─── LOGIN PAGE (Website Landing) ───
export const LoginPage = ({ onSelect }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [modal, setModal] = useState(null); // null | "choose" | "referral" | "ops"
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginId || !loginPass) return;
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      setModal(null);
      setLoginId("");
      setLoginPass("");
      onSelect("login");
    }, 1200);
  };

  const openRole = (role) => {
    setModal(role);
    setLoginId("");
    setLoginPass("");
    setLoginLoading(false);
  };

  const closeModal = () => {
    setModal(null);
    setLoginId("");
    setLoginPass("");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing-page">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Navbar ── */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <span>N</span>
          </div>
          <div className="nav-logo-text">
            <div className="nav-logo-title">Navachetana</div>
            <div className="nav-logo-subtitle">Livelihoods</div>
          </div>
        </div>

        {/* Desktop links */}
        <div className="nav-links">
          <span className="nav-link nav-link-active">Home</span>
          <span className="nav-link">About</span>
          <span className="nav-link">Services</span>
          <span className="nav-link">How It Works</span>

          {/* Empanel Dropdown */}
          <div ref={dropRef} className="nav-dropdown">
            <button
              className="nav-link nav-dropdown-trigger"
              onClick={() => setDropOpen(!dropOpen)}
            >
              Empanel{" "}
              <span
                className="nav-dropdown-arrow"
                style={{
                  transform: dropOpen ? "rotate(180deg)" : "none",
                }}
              >
                ▾
              </span>
            </button>
            {dropOpen && (
              <div className="nav-dropdown-menu">
                <button
                  className="nav-dropdown-item"
                  onClick={() => {
                    setDropOpen(false);
                    openRole("referral");
                  }}
                >
                  <span className="nav-dropdown-item-icon">⚡</span>
                  <span className="nav-dropdown-item-label">Empanel</span>
                </button>
                <button
                  className="nav-dropdown-item"
                  onClick={() => {
                    setDropOpen(false);
                    setModal("choose");
                  }}
                >
                  <span className="nav-dropdown-item-icon">🔐</span>
                  <span className="nav-dropdown-item-label">Login</span>
                </button>
              </div>
            )}
          </div>

          <button
            className="nav-cta"
            onClick={() => onSelect("connector")}
          >
            Contact Us
          </button>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu} />
      )}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        <button className="mobile-menu-close" onClick={closeMenu}>
          ×
        </button>
        <span className="mobile-menu-link" onClick={closeMenu}>
          Home
        </span>
        <span className="mobile-menu-link" onClick={closeMenu}>
          About
        </span>
        <span className="mobile-menu-link" onClick={closeMenu}>
          Services
        </span>
        <span className="mobile-menu-link" onClick={closeMenu}>
          How It Works
        </span>
        <span
          className="mobile-menu-link"
          onClick={() => {
            closeMenu();
            openRole("referral");
          }}
        >
          Empanel
        </span>
        <span
          className="mobile-menu-link"
          onClick={() => {
            closeMenu();
            setModal("choose");
          }}
        >
          Login
        </span>
        <button
          className="nav-cta mobile-menu-cta"
          onClick={() => {
            closeMenu();
            onSelect("connector");
          }}
        >
          Contact Us
        </button>
      </div>

      {/* ── Hero Section ── */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="hero-title-accent">Navachetana Livelihoods</span>
          </h1>
          <p className="hero-subtitle">
            Empowering growth through microfinance. Accessible financial
            solutions for rural communities, women entrepreneurs, and small
            businesses across India.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => onSelect("connector")}
            >
              Get Started
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setModal("choose")}
            >
              Partner Login
            </button>
          </div>
          <div className="stats-row">
            {[
              ["10,000+", "Borrowers"],
              ["500+", "Partners"],
              ["₹50Cr+", "Disbursed"],
            ].map(([n, l]) => (
              <div className="stat-item" key={l}>
                <div className="stat-number">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-circle-outer">
            <div className="hero-circle-inner">
              <span className="hero-emoji">🏦</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Login Modal ── */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
          <div className="modal">
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            {modal === "choose" ? (
              <>
                <div className="modal-icon">🔐</div>
                <h2 className="modal-title">Login</h2>
                <p className="modal-desc">Select your role to continue</p>
                <div className="modal-roles">
                  {[
                    ["referral", "⚡", "Empanel", "Field ops & client connections"],
                    ["ops", "📊", "Operational Manager", "Reports & analytics"],
                  ].map(([id, ic, nm, desc]) => (
                    <button
                      key={id}
                      className="card-light modal-role-card"
                      onClick={() => openRole(id)}
                    >
                      <div className="modal-role-icon">{ic}</div>
                      <div className="modal-role-info">
                        <div className="modal-role-name">{nm}</div>
                        <div className="modal-role-desc">{desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  className="modal-back"
                  onClick={() => setModal("choose")}
                >
                  ← Back
                </button>
                <div className="modal-icon">
                  {modal === "referral" ? "⚡" : "📊"}
                </div>
                <h2 className="modal-title">
                  {modal === "referral"
                    ? "Empanel Login"
                    : "Operational Manager Login"}
                </h2>
                <p className="modal-desc">
                  Enter your credentials to sign in
                </p>
                <form onSubmit={handleLogin}>
                  <div className="input-group">
                    <label className="input-label">ID</label>
                    <input
                      className="input-field"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder={
                        modal === "referral"
                          ? "e.g. NC-CON-2026-48231"
                          : "e.g. NV-OPS-001"
                      }
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <input
                      className="input-field"
                      type="password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary modal-submit"
                    disabled={!loginId || !loginPass || loginLoading}
                  >
                    {loginLoading ? "Signing in..." : "Login"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <p className="landing-footer">
        © 2026 Navachetana Livelihoods Pvt. Ltd. All rights reserved.
      </p>
    </div>
  );
};

// ─── GOOGLE AUTH PAGE ───
export const GoogleAuthPage = ({ onDone, onBack, role }) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "email profile",
        callback: (response) => {
          if (response.error) {
            setLoading(false);
            setError("Authentication failed. Please try again.");
            return;
          }
          fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${response.access_token}` },
          })
            .then((r) => r.json())
            .then((info) => {
              setLoading(false);
              setDone(true);
              setUser({
                name: info.name,
                email: info.email,
                picture: info.picture,
              });
              setTimeout(onDone, 1200);
            })
            .catch(() => {
              setLoading(false);
              setError("Could not fetch profile. Please try again.");
            });
        },
      });
      client.requestAccessToken();
    } catch {
      setLoading(false);
      setError("Google Sign-In not available. Please try again.");
    }
  }, [onDone]);

  return (
    <PageShell
      onBack={onBack}
      step={role === "ops" ? 0 : 0}
      totalSteps={role === "ops" ? 2 : 6}
    >
      <Brand small />
      <Card>
        <h2 className="auth-heading">Sign in with Google</h2>
        <p className="auth-subheading">
          Verify your identity to continue as{" "}
          {role === "ops" ? "Operations Manager" : "Empanel"}
        </p>
        {done && user ? (
          <div className="auth-success">
            {user.picture && (
              <img
                className="auth-avatar"
                src={user.picture}
                alt=""
              />
            )}
            {!user.picture && (
              <div className="auth-check-icon">
                <span>✓</span>
              </div>
            )}
            <p className="auth-user-name">{user.name}</p>
            <p className="auth-user-email">{user.email}</p>
            <p className="auth-verified">Authenticated ✓</p>
          </div>
        ) : (
          <>
            <button
              className="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? (
                <Spinner size={20} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
              )}
              <span className="google-signin-label">
                {loading ? "Signing in..." : "Continue with Google"}
              </span>
            </button>
            {error && <p className="auth-error">{error}</p>}
          </>
        )}
      </Card>
    </PageShell>
  );
};

// ─── MOBILE AUTH PAGE ───
export const MobileAuthPage = ({ onDone, onBack }) => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const sendOtp = () => {
    if (phone.length >= 10) setOtpSent(true);
  };

  const handleOtpComplete = (otp) => {
    setVerifying(true);
    setTimeout(onDone, 1300);
  };

  return (
    <PageShell onBack={onBack} step={1} totalSteps={6}>
      <Brand small />
      <Card>
        <h2 className="auth-heading">Mobile Verification</h2>
        <p className="auth-subheading">
          OTP will be sent to verify your number
        </p>
        {!otpSent ? (
          <>
            <div className="phone-input-row">
              <div className="phone-prefix">+91</div>
              <div className="phone-input-wrap">
                <Input
                  label="Mobile Number"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={setPhone}
                  type="tel"
                  required
                />
              </div>
            </div>
            <Btn onClick={sendOtp} disabled={phone.length < 10} full>
              Send OTP
            </Btn>
          </>
        ) : (
          <>
            <p className="auth-subheading">
              OTP sent to +91 {phone.slice(0, 2)}****{phone.slice(-2)}
            </p>
            <div className="otp-container">
              <OtpInput length={6} onComplete={handleOtpComplete} />
            </div>
            {verifying && (
              <div className="auth-verifying">
                <Spinner size={20} />
                <p className="auth-verifying-text">Verifying...</p>
              </div>
            )}
          </>
        )}
      </Card>
    </PageShell>
  );
};

// ─── EMPANEL / REF PARTNER LOGIN PAGE ───
export const RefPartnerLoginPage = ({ onDone, onBack }) => {
  const [partnerId, setPartnerId] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(onDone, 1400);
  };

  return (
    <PageShell onBack={onBack}>
      <Brand small />
      <Card>
        <h2 className="auth-heading">Empanel Login</h2>
        <p className="auth-subheading">Sign in with your credentials</p>
        <Input
          label="Empanel ID"
          placeholder="e.g. NC-CON-2026-48231"
          value={partnerId}
          onChange={setPartnerId}
          required
          icon="🔑"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={pass}
          onChange={setPass}
          type="password"
          required
          icon="🔒"
        />
        <Btn
          onClick={handleLogin}
          disabled={!partnerId || !pass || loading}
          full
          color="#34d399"
        >
          {loading ? "Signing in..." : "Login"}
        </Btn>
      </Card>
    </PageShell>
  );
};
