// import { useState } from "react";
// import api from "./api";
// import "./Login.css";

// function Login({ onLogin }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const response = await api.post("/login/", {
//         username: username,
//         password: password,
//       });

//       // Save JWT tokens
//       localStorage.setItem("access_token", response.data.access);
//       localStorage.setItem("refresh_token", response.data.refresh);

//       // Tell App that login was successful
//       onLogin();
//     } catch (error) {
//       console.error("Login error:", error);

//       setError("Invalid username or password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       {/* Background decoration */}
//       <div className="login-grid"></div>

//       {/* Top navigation */}
//       <header className="login-header">
//         <div className="login-logo">
//           <span className="logo-mark">T</span>
//           <span>TASKFLOW</span>
//         </div>

//         <div className="login-header-status">
//           <span className="status-dot"></span>
//           Secure workspace
//         </div>
//       </header>

//       {/* Main content */}
//       <main className="login-main">
//         {/* Left side */}
//         <section className="login-intro">
//           <p className="login-eyebrow">PERSONAL PRODUCTIVITY PLATFORM</p>

//           <h1>
//             Make your
//             <br />
//             <span>progress</span>
//             <br />
//             visible.
//           </h1>

//           <p className="login-description">
//             Organize your work, focus on what matters, and turn everyday tasks
//             into meaningful progress.
//           </p>

//           <div className="login-features">
//             <div className="feature-item">
//               <span className="feature-number">01</span>
//               <span>Organize your tasks</span>
//             </div>

//             <div className="feature-item">
//               <span className="feature-number">02</span>
//               <span>Track your progress</span>
//             </div>

//             <div className="feature-item">
//               <span className="feature-number">03</span>
//               <span>Get things done</span>
//             </div>
//           </div>
//         </section>

//         {/* Login card */}
//         <section className="login-panel">
//           <div className="login-panel-top">
//             <span>WELCOME BACK</span>
//             <span>01 / 01</span>
//           </div>

//           <div className="login-panel-content">
//             <h2>Sign in</h2>

//             <p className="login-subtitle">
//               Enter your credentials to access your workspace.
//             </p>

//             <form onSubmit={handleLogin}>
//               {/* Username */}
//               <div className="input-group">
//                 <label htmlFor="username">USERNAME</label>

//                 <input
//                   id="username"
//                   type="text"
//                   value={username}
//                   onChange={(event) => setUsername(event.target.value)}
//                   placeholder="Enter your username"
//                   required
//                   autoComplete="username"
//                 />
//               </div>

//               {/* Password */}
//               <div className="input-group">
//                 <label htmlFor="password">PASSWORD</label>

//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                   placeholder="Enter your password"
//                   required
//                   autoComplete="current-password"
//                 />
//               </div>

//               {/* Error */}
//               {error && (
//                 <div className="login-error">
//                   <span>!</span>
//                   {error}
//                 </div>
//               )}

//               {/* Login button */}
//               <button type="submit" className="login-button" disabled={loading}>
//                 <span>{loading ? "AUTHENTICATING..." : "ENTER WORKSPACE"}</span>

//                 {!loading && <span className="button-arrow">↗</span>}
//               </button>
//             </form>
//           </div>

//           <div className="login-panel-bottom">
//             <span>JWT AUTHENTICATION</span>
//             <span>ENCRYPTED SESSION</span>
//           </div>
//         </section>
//       </main>

//       {/* Bottom marquee */}
//       <div className="login-marquee">
//         <div className="marquee-track">
//           <span>PLAN</span>
//           <span>•</span>
//           <span>PRIORITIZE</span>
//           <span>•</span>
//           <span>EXECUTE</span>
//           <span>•</span>
//           <span>COMPLETE</span>
//           <span>•</span>

//           <span>PLAN</span>
//           <span>•</span>
//           <span>PRIORITIZE</span>
//           <span>•</span>
//           <span>EXECUTE</span>
//           <span>•</span>
//           <span>COMPLETE</span>
//           <span>•</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import api from "./api";
import "./Login.css";

function Login({ onLoginOTP, onRegister }) {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      await api.post("/auth/login/", {
        email: normalizedEmail,
      });

      // API succeeded — move to OTP screen
      onLoginOTP(normalizedEmail);
    } catch (error) {
      console.error("Login OTP error:", error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.email) {
        setError(error.response.data.email[0]);
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Unable to send OTP. Please try again.");
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
            Make your
            <br />
            <span>progress</span>
            <br />
            visible.
          </h1>

          <p className="login-description">
            Organize your work, focus on what matters, and turn everyday tasks
            into meaningful progress.
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

        {/* Login card */}
        <section className="login-panel">
          <div className="login-panel-top">
            <span>WELCOME BACK</span>
            <span>01 / 02</span>
          </div>

          <div className="login-panel-content">
            <h2>Sign in</h2>

            <p className="login-subtitle">
              Enter your email address and we'll send you a secure login OTP.
            </p>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="input-group">
                <label htmlFor="login-email">EMAIL</label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
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
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                <span>
                  {loading ? "SENDING OTP..." : "SEND LOGIN OTP"}
                </span>

                {!loading && <span className="button-arrow">↗</span>}
              </button>
            </form>

            {/* Register */}
            <div className="register-switch">
              <span>Don't have an account?</span>

              <button
                type="button"
                className="register-link"
                onClick={onRegister}
              >
                Create account
              </button>
            </div>
          </div>

          <div className="login-panel-bottom">
            <span>EMAIL OTP AUTHENTICATION</span>
            <span>SECURE SESSION</span>
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

export default Login;
;
