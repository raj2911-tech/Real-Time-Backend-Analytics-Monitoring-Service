import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const inputStyle = {
  display: "block", width: "100%", padding: "9px 12px",
  fontSize: 13, color: "#111827",
  border: "1px solid #e5e7eb", borderRadius: 7,
  outline: "none", boxSizing: "border-box",
  background: "#fff", fontFamily: "inherit"
};

function ApiKeyModal({ apiKey, onContinue }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16
    }}>
      <div style={{
        background: "#fff", borderRadius: 12,
        padding: "32px 28px", width: "100%", maxWidth: 420,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
      }}>
        {/* Icon */}
        <div style={{
          width: 44, height: 44, background: "#f0fdf4",
          border: "1px solid #bbf7d0", borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
          Your API Key
        </h3>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.5 }}>
          Copy and save this key now.
        </p>

        {/* API Key Box */}
        <div style={{
          background: "#f9fafb", border: "1px solid #e5e7eb",
          borderRadius: 8, padding: "10px 12px",
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 20
        }}>
          <code style={{
            flex: 1, fontSize: 12, color: "#111827",
            wordBreak: "break-all", lineHeight: 1.6,
            fontFamily: "'Courier New', monospace"
          }}>
            {apiKey}
          </code>
          <button
            onClick={handleCopy}
            style={{
              flexShrink: 0, padding: "6px 12px",
              fontSize: 12, fontWeight: 600,
              background: copied ? "#f0fdf4" : "#111827",
              color: copied ? "#16a34a" : "#fff",
              border: copied ? "1px solid #bbf7d0" : "1px solid transparent",
              borderRadius: 6, cursor: "pointer",
              transition: "all 0.15s", whiteSpace: "nowrap"
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <button
          onClick={onContinue}
          style={{
            width: "100%", padding: "10px",
            background: "#111827", color: "#fff",
            fontSize: 13, fontWeight: 600,
            border: "none", borderRadius: 7, cursor: "pointer"
          }}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", companyName: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [userData, setUserData] = useState(null);

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
        `${BASE_URL}/api/auth/register`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      const { apiKey, user } = response.data;

      setUserData(user);
      setApiKey(apiKey);

    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Registration failed.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify({ name: userData.name, role: userData.role }));
    }
    navigate("/dashboard");
  };

  return (
    <>
      {apiKey && <ApiKeyModal apiKey={apiKey} onContinue={handleContinue} />}

      <div style={{
        minHeight: "100vh", background: "#f3f4f6",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", padding: 16
      }}>
        <div style={{
          background: "#fff", border: "1px solid #e5e7eb",
          borderRadius: 12, padding: "36px 32px",
          width: "100%", maxWidth: 400
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

          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Create account</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>Start monitoring your APIs in minutes</p>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Name</label>
              <input
                type="text" name="name" placeholder="John Doe"
                value={formData.name} onChange={handleChange} required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#111827"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
              <input
                type="email" name="email" placeholder="you@company.com"
                value={formData.email} onChange={handleChange} required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#111827"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
              <input
                type="password" name="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#111827"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Company Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Company Name</label>
              <input
                type="text" name="companyName" placeholder="Acme Inc."
                value={formData.companyName} onChange={handleChange} required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#111827"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Error */}
            {message && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 7, padding: "9px 12px",
                fontSize: 13, color: "#dc2626", marginBottom: 16
              }}>
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "10px",
                background: loading ? "#6b7280" : "#111827",
                color: "#fff", fontSize: 13, fontWeight: 600,
                border: "none", borderRadius: 7,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s", fontFamily: "inherit"
              }}
              onMouseEnter={(e) => { if (!loading) e.target.style.background = "#1f2937"; }}
              onMouseLeave={(e) => { if (!loading) e.target.style.background = "#111827"; }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", marginTop: 20 }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>Sign in</a>
          </p>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </>
  );
}

export default Register;