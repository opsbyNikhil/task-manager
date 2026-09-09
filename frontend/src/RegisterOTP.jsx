import { useState } from "react";
import api from "./api";
import "./Login.css";

function RegisterOTP({ email, onRegistrationComplete, onBack }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async (event) => {
    event.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/verify-registration-otp/", {
        email: email,
        otp: otp,
      });

      // Registration completed successfully.
      onRegistrationComplete();
    } catch (error) {
      console.error("OTP verification error:", error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.otp) {
        setError(error.response.data.otp[0]);
      } else {
        setError("Invalid or expired OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (event) => {
    const value = event.target.value;

    // Allow digits only
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError("");
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
            Verify your
            <br />
            <span>account</span>
            <br />
            securely.
          </h1>

          <p className="login-description">
            We have sent a verification code to your email address. Enter the
            code to complete your TASKFLOW registration.
          </p>

          <div className="login-features">
            <div className="feature-item">
              <span className="feature-number">01</span>
              <span>Check your email</span>
            </div>

            <div className="feature-item">
              <span className="feature-number">02</span>
              <span>Enter your OTP</span>
            </div>

            <div className="feature-item">
              <span className="feature-number">03</span>
              <span>Complete registration</span>
            </div>
          </div>
        </section>

        {/* OTP card */}
        <section className="login-panel">
          <div className="login-panel-top">
            <span>VERIFY ACCOUNT</span>
            <span>02 / 02</span>
          </div>

          <div className="login-panel-content">
            <h2>Enter OTP</h2>

            <p className="login-subtitle">
              Enter the 6-digit verification code sent to:
            </p>

            <p className="otp-email">{email}</p>

            <form onSubmit={handleVerifyOTP}>
              {/* OTP */}
              <div className="input-group">
                <label htmlFor="registration-otp">VERIFICATION CODE</label>

                <input
                  id="registration-otp"
                  type="text"
                  value={otp}
                  onChange={handleOTPChange}
                  placeholder="Enter 6-digit OTP"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              {/* Error */}
              {error && (
                <div className="login-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              {/* Verify button */}
              <button type="submit" className="login-button" disabled={loading}>
                <span>
                  {loading ? "VERIFYING..." : "VERIFY & CREATE ACCOUNT"}
                </span>

                {!loading && <span className="button-arrow">↗</span>}
              </button>
            </form>

            {/* Back */}
            <div className="register-switch">
              <span>Wrong email?</span>

              <button type="button" className="register-link" onClick={onBack}>
                Back to registration
              </button>
            </div>
          </div>

          <div className="login-panel-bottom">
            <span>EMAIL OTP AUTHENTICATION</span>
            <span>SECURE VERIFICATION</span>
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

export default RegisterOTP;
