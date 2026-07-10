import { useState } from "react";


function AuthPage({
  onLogin,
  onRegister,
  loading,
  error,
}) {
  const [mode, setMode] =
    useState("login");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  function handleSubmit(event) {
    event.preventDefault();

    if (mode === "login") {
      onLogin(email, password);
    } else {
      onRegister(
        name,
        email,
        password
      );
    }
  }


  return (
    <div className="auth-page">

      <div className="auth-brand-section">

        <div className="auth-brand-content">

          <div className="auth-logo">
            JT
          </div>

          <h1>
            Turn applications into
            opportunities.
          </h1>

          <p>
            Track your job applications,
            monitor progress, and understand
            your job search pipeline.
          </p>

        </div>

      </div>


      <div className="auth-form-section">

        <div className="auth-card">

          <div className="auth-card-header">

            <p className="section-eyebrow">
              JOBTRACK
            </p>

            <h2>
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to continue to your dashboard."
                : "Start organizing your job search."}
            </p>

          </div>


          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {mode === "register" && (
              <div className="form-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />

              </div>
            )}


            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>


            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            <button
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </button>

          </form>


          <div className="auth-switch">

            <span>
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={() => {
                setMode(
                  mode === "login"
                    ? "register"
                    : "login"
                );
              }}
            >
              {mode === "login"
                ? "Create account"
                : "Sign in"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


export default AuthPage;