import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Profile({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/dashboard/profile`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (ts) =>
    new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const rows = profile ? [
    { label: "Name",         value: profile.name },
    { label: "Email",        value: profile.email },
    { label: "Role",         value: profile.role },
    { label: "Company",      value: profile.companyName },
    { label: "API Key",      value: profile.apiKey, isKey: true },
    { label: "Member Since", value: formatDate(profile.createdAt) },
  ] : [];

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 12,
        border: "1px solid #e5e7eb",
        width: "100%", maxWidth: 400,
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        fontFamily: "'DM Sans', sans-serif"
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #e5e7eb"
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Profile</h3>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 6,
              background: "#f3f4f6", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#6b7280", fontSize: 16, lineHeight: 1
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "8px 0 16px" }}>
          {loading && (
            <div style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
              Loading...
            </div>
          )}

          {error && (
            <div style={{
              margin: "12px 20px", padding: "10px 14px",
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 7, fontSize: 13, color: "#dc2626"
            }}>
              {error}
            </div>
          )}

          {profile && rows.map(({ label, value, isKey }) => (
            <div
              key={label}
              style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 20px", gap: 16
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", flexShrink: 0, width: 100 }}>
                {label}
              </span>

              {isKey ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                  <code style={{
                    fontSize: 12, color: "#111827",
                    background: "#f9fafb", border: "1px solid #e5e7eb",
                    borderRadius: 5, padding: "3px 8px",
                    fontFamily: "'Courier New', monospace",
                    wordBreak: "break-all"
                  }}>
                    {value}
                  </code>
                  <button
                    onClick={handleCopy}
                    style={{
                      flexShrink: 0, padding: "4px 10px",
                      fontSize: 11, fontWeight: 600,
                      background: copied ? "#f0fdf4" : "#111827",
                      color: copied ? "#16a34a" : "#fff",
                      border: copied ? "1px solid #bbf7d0" : "1px solid transparent",
                      borderRadius: 5, cursor: "pointer",
                      transition: "all 0.15s", whiteSpace: "nowrap"
                    }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              ) : (
                <span style={{
                  fontSize: 13, color: "#111827", textAlign: "right",
                  flex: 1, wordBreak: "break-word"
                }}>
                  {label === "Role"
                    ? <span style={{
                        background: "#f3f4f6", borderRadius: 4,
                        padding: "2px 8px", fontSize: 11, fontWeight: 600,
                        color: "#374151", textTransform: "capitalize"
                      }}>{value}</span>
                    : value
                  }
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Profile;