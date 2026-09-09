import { useState } from "react";
import api from "./api";
import "./Login.css";

function Register({ onRegisterOTP, onBackToLogin }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register/", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        mobile: mobile.trim(),
        email: email.trim().toLowerCase(),
      });

      console.log("Registration OTP:", response.data);

      // Move to OTP verification screen
      onRegisterOTP(email.trim().toLowerCase());
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data) {
        const data = error.response.data;

        if (data.email) {
          setError(data.email[0]);
        } else if (data.mobile) {
          setError(data.mobile[0]);
        } else if (data.error) {
          setError(data.error);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Unable to start registration. Please try again.");
        }
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-grid"></div>

      {/* Top navigation */}
      <header className="login-header">
        <div className="login-logo">
          <span className="logo-mark">T</span>
          <span>TASKFLOW</span>
        </div>

        <div className="login-header-status">
          <span className="status-dot"></span>
          Secure workspace
        </div>
      </header>

      {/* Main content */}
      <main className="login-main">
        {/* Left side */}
        <section className="login-intro">
          <p className="login-eyebrow">PERSONAL PRODUCTIVITY PLATFORM</p>

          <h1>
            Start your
            <br />
            <span>progress</span>
            <br />
            today.
          </h1>

          <p className="login-description">
            Create your TASKFLOW account and organize your work, track your
            progress, and get things done.
          </p>

          <div className="login-features">
            <div className="feature-item">
              <span className="feature-number">01</span>
              <span>Organize your tasks</span>
            </div>

            <div className="feature-item">
              <span className="feature-number">02</span>
              <span>Track your progress</span>
            </div>

            <div className="feature-item">
              <span className="feature-number">03</span>
              <span>Get things done</span>
            </div>
          </div>
        </section>

        {/* Registration card */}
        <section className="login-panel">
          <div className="login-panel-top">
            <span>CREATE ACCOUNT</span>
            <span>01 / 02</span>
          </div>

          <div className="login-panel-content">
            <h2>Register</h2>

            <p className="login-subtitle">
              Create your account using your email address.
            </p>

            <form onSubmit={handleRegister}>
              {/* First name */}
              <div className="input-group">
                <label htmlFor="first-name">FIRST NAME</label>

                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Enter your first name"
                  required
                  autoComplete="given-name"
                />
              </div>

              {/* Last name */}
              <div className="input-group">
                <label htmlFor="last-name">LAST NAME</label>

                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Enter your last name"
                  required
                  autoComplete="family-name"
                />
              </div>

              {/* Mobile */}
              <div className="input-group">
                <label htmlFor="mobile">MOBILE NUMBER</label>

                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                  placeholder="Enter your mobile number"
                  required
                  autoComplete="tel"
                  inputMode="numeric"
                />
              </div>

              {/* Email */}
              <div className="input-group">
                <label htmlFor="register-email">EMAIL</label>

                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="login-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              {/* Send OTP */}
              <button type="submit" className="login-button" disabled={loading}>
                <span>
                  {loading ? "SENDING OTP..." : "SEND REGISTRATION OTP"}
                </span>

                {!loading && <span className="button-arrow">↗</span>}
              </button>
            </form>

            {/* Back to login */}
            <div className="register-switch">
              <span>Already have an account?</span>

              <button
                type="button"
                className="register-link"
                onClick={onBackToLogin}
              >
                Sign in
              </button>
            </div>
          </div>

          <div className="login-panel-bottom">
            <span>EMAIL OTP AUTHENTICATION</span>
            <span>SECURE REGISTRATION</span>
          </div>
        </section>
      </main>

      {/* Bottom marquee */}
      <div className="login-marquee">
        <div className="marquee-track">
          <span>PLAN</span>
          <span>•</span>
          <span>PRIORITIZE</span>
          <span>•</span>
          <span>EXECUTE</span>
          <span>•</span>
          <span>COMPLETE</span>
          <span>•</span>

          <span>PLAN</span>
          <span>•</span>
          <span>PRIORITIZE</span>
          <span>•</span>
          <span>EXECUTE</span>
          <span>•</span>
          <span>COMPLETE</span>
          <span>•</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
