import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const { user } = response.data;

      // Store user info (name + role) for Dashboard to consume
      localStorage.setItem("user", JSON.stringify({ name: user.name, role: user.role }));

      navigate("/dashboard");

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Invalid credentials.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "36px 32px",
        width: "100%",
        maxWidth: 400,
      }}>

        {/* Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 32, height: 32, background: "#111827", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="8" width="3" height="7" rx="1" fill="white" />
              <rect x="6" y="4" width="3" height="11" rx="1" fill="white" />
              <rect x="11" y="1" width="3" height="14" rx="1" fill="white" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>API Monitor</span>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Sign in</h2>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>Enter your credentials to access the dashboard</p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                display: "block", width: "100%", padding: "9px 12px",
                fontSize: 13, color: "#111827",
                border: "1px solid #e5e7eb", borderRadius: 7,
                outline: "none", boxSizing: "border-box",
                background: "#fff",
              }}
              onFocus={(e) => e.target.style.borderColor = "#111827"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                display: "block", width: "100%", padding: "9px 12px",
                fontSize: 13, color: "#111827",
                border: "1px solid #e5e7eb", borderRadius: 7,
                outline: "none", boxSizing: "border-box",
                background: "#fff",
              }}
              onFocus={(e) => e.target.style.borderColor = "#111827"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Error Message */}
          {message && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 7, padding: "9px 12px",
              fontSize: 13, color: "#dc2626", marginBottom: 16
            }}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "10px",
              background: loading ? "#6b7280" : "#111827",
              color: "#fff", fontSize: 13, fontWeight: 600,
              border: "none", borderRadius: 7,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s"
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#1f2937"; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#111827"; }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}

export default Login;