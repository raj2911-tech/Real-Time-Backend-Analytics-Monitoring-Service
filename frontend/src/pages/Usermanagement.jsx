import { useState, useEffect } from "react";

const API_BASE = "http://localhost:7000/api/dashboard";
const OPTS = { credentials: "include" };

const inputStyle = {
  display: "block", width: "100%", padding: "9px 12px",
  fontSize: 13, color: "#111827",
  border: "1px solid #e5e7eb", borderRadius: 7,
  outline: "none", boxSizing: "border-box",
  background: "#fff", fontFamily: "inherit"
};

function formatDate(ts) {
  return new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

// ── Add User Modal ──────────────────────────────────────────────
function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/user-management/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to add user."); return; }
      onSuccess(data.user);
      onClose();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
        width: "100%", maxWidth: 380,
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)", fontFamily: "'DM Sans', sans-serif"
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #e5e7eb"
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Add User</h3>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6, background: "#f3f4f6",
            border: "none", cursor: "pointer", fontSize: 16, color: "#6b7280"
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
          >✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Name</label>
            <input
              type="text" name="name" placeholder="John Doe"
              value={form.name} onChange={handleChange} required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#111827"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
            <input
              type="email" name="email" placeholder="john@company.com"
              value={form.email} onChange={handleChange} required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#111827"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
            <input
              type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#111827"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7,
              padding: "9px 12px", fontSize: 13, color: "#dc2626", marginBottom: 16
            }}>{error}</div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: "9px", fontSize: 13, fontWeight: 600,
              background: "#fff", color: "#374151",
              border: "1px solid #e5e7eb", borderRadius: 7, cursor: "pointer"
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: "9px", fontSize: 13, fontWeight: 600,
              background: loading ? "#6b7280" : "#111827", color: "#fff",
              border: "none", borderRadius: 7,
              cursor: loading ? "not-allowed" : "pointer"
            }}>
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ────────────────────────────────────────
function DeleteModal({ user, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/user-management/delete/${user._id}`, {
        method: "POST",
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to delete user."); return; }
      onSuccess(user._id);
      onClose();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 16
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
        width: "100%", maxWidth: 360,
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)", fontFamily: "'DM Sans', sans-serif",
        padding: "28px 24px"
      }}>
        {/* Icon */}
        <div style={{
          width: 44, height: 44, background: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Delete User</h3>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.5 }}>
          Are you sure you want to delete <strong style={{ color: "#111827" }}>{user.name}</strong>? This action cannot be undone.
        </p>

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7,
            padding: "9px 12px", fontSize: 13, color: "#dc2626", marginBottom: 16
          }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "9px", fontSize: 13, fontWeight: 600,
            background: "#fff", color: "#374151",
            border: "1px solid #e5e7eb", borderRadius: 7, cursor: "pointer"
          }}>Cancel</button>
          <button onClick={handleDelete} disabled={loading} style={{
            flex: 1, padding: "9px", fontSize: 13, fontWeight: 600,
            background: loading ? "#6b7280" : "#dc2626", color: "#fff",
            border: "none", borderRadius: 7, cursor: loading ? "not-allowed" : "pointer"
          }}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/user-management`, OPTS)
      .then(async (r) => {
        const data = await r.json();
        if (r.status === 403) { setIsUnauthorized(true); return; }
        if (!r.ok) { setError(data.message || "Failed to load users."); return; }
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const handleUserAdded = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUserDeleted = (deletedId) => {
    setUsers((prev) => prev.filter((u) => u._id !== deletedId));
  };

  if (isUnauthorized) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f3f4f6",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", padding: 24
      }}>
        <div style={{
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
          padding: "40px 36px", maxWidth: 420, width: "100%", textAlign: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
        }}>
          <div style={{
            width: 52, height: 52, background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
            Access Denied
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: "0 0 6px" }}>
            You don't have permission to view this page.
          </p>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: "0 0 28px" }}>
            This section is restricted to <strong style={{ color: "#111827" }}>admin</strong> users only.
          </p>
          <a href="/dashboard" style={{
            display: "inline-block", padding: "9px 24px",
            background: "#111827", color: "#fff",
            fontSize: 13, fontWeight: 600, textDecoration: "none",
            borderRadius: 7
          }}>← Back to Dashboard</a>
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Modals */}
      {showAdd && (
        <AddUserModal onClose={() => setShowAdd(false)} onSuccess={handleUserAdded} />
      )}
      {deleteTarget && (
        <DeleteModal user={deleteTarget} onClose={() => setDeleteTarget(null)} onSuccess={handleUserDeleted} />
      )}

      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "0 28px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: "#111827", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="8" width="3" height="7" rx="1" fill="white" />
              <rect x="6" y="4" width="3" height="11" rx="1" fill="white" />
              <rect x="11" y="1" width="3" height="14" rx="1" fill="white" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>API Monitor</span>
        </div>
        <a href="/dashboard" style={{
          fontSize: 13, fontWeight: 600, color: "#374151",
          textDecoration: "none", padding: "7px 14px",
          border: "1px solid #e5e7eb", borderRadius: 7, background: "#fff"
        }}>← Back to Dashboard</a>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>

        {/* Page Title + Add Button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>User Management</h1>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>
              Manage users in your organization
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: "8px 16px", fontSize: 13, fontWeight: 600,
              background: "#111827", color: "#fff",
              border: "none", borderRadius: 7, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1f2937"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#111827"}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add User
          </button>
        </div>

        {/* Users Table */}
        {loading && (
          <div style={{
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
            padding: 32, textAlign: "center", color: "#9ca3af", fontSize: 13
          }}>Loading...</div>
        )}

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
            padding: 14, color: "#dc2626", fontSize: 13
          }}>{error}</div>
        )}

        {!loading && !error && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>

            {/* Table header row with count */}
            <div style={{
              padding: "12px 16px", borderBottom: "1px solid #e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                All Users
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600, color: "#6b7280",
                background: "#f3f4f6", borderRadius: 20, padding: "2px 10px"
              }}>
                {users.length} {users.length === 1 ? "user" : "users"}
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Name", "Email", "Role", "Created At", "Action"].map((col) => (
                      <th key={col} style={{
                        textAlign: "left", padding: "8px 16px",
                        background: "#f9fafb", color: "#374151",
                        fontWeight: 600, borderBottom: "1px solid #e5e7eb",
                        whiteSpace: "nowrap"
                      }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>
                        No users found. Add your first user.
                      </td>
                    </tr>
                  ) : users.map((user, i) => (
                    <tr key={user._id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6", color: "#111827", fontWeight: 500 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: "50%",
                            background: "#111827", color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, flexShrink: 0
                          }}>
                            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          {user.name}
                        </div>
                      </td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6", color: "#374151" }}>
                        {user.email}
                      </td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6" }}>
                        <span style={{
                          background: user.role === "admin" ? "#111827" : "#f3f4f6",
                          color: user.role === "admin" ? "#fff" : "#374151",
                          borderRadius: 4, padding: "2px 8px",
                          fontSize: 11, fontWeight: 600, textTransform: "capitalize"
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6", color: "#6b7280", fontSize: 12, whiteSpace: "nowrap" }}>
                        {formatDate(user.createdAt)}
                      </td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6" }}>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          style={{
                            padding: "5px 12px", fontSize: 12, fontWeight: 600,
                            background: "#fff", color: "#dc2626",
                            border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}