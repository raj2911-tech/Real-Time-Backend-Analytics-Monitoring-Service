import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile.jsx";

const API_BASE = "http://localhost:7000/api/dashboard";
const OPTS = { credentials: "include" };



const STATUS_COLOR = (code) => {
  if (code >= 500) return "#dc2626";
  if (code >= 400) return "#f59e0b";
  if (code >= 300) return "#6366f1";
  return "#16a34a";
};

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "medium" });
}

function StatCard({ label, value, unit }) {
  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: 8,
      padding: "16px 20px", background: "#fff",
      minWidth: 140, flex: "1 1 140px"
    }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#111827" }}>
        {value}
        {unit && <span style={{ fontSize: 14, fontWeight: 400, color: "#6b7280", marginLeft: 4 }}>{unit}</span>}
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "28px 0 10px", borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>
      {title}
    </h2>
  );
}

function SectionWrapper({ loading, error, children }) {
  if (loading) return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 24, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
      Loading...
    </div>
  );
  if (error) return (
    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 14, color: "#dc2626", fontSize: 13 }}>
      {error}
    </div>
  );
  return children;
}

function Table({ columns, rows, renderRow }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} style={{
                textAlign: "left", padding: "8px 12px",
                background: "#f9fafb", color: "#374151",
                fontWeight: 600, borderBottom: "1px solid #e5e7eb",
                whiteSpace: "nowrap"
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={columns.length} style={{ padding: 20, textAlign: "center", color: "#9ca3af" }}>No data</td></tr>
            : rows.map((row, i) => renderRow(row, i))}
        </tbody>
      </table>
    </div>
  );
}

const TD = ({ children, style = {} }) => (
  <td style={{ padding: "8px 12px", borderBottom: "1px solid #f3f4f6", color: "#374151", ...style }}>
    {children}
  </td>
);

const MethodBadge = ({ method }) => (
  <span style={{ background: "#f3f4f6", borderRadius: 4, padding: "2px 7px", fontSize: 11, fontWeight: 600, color: "#374151" }}>
    {method}
  </span>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : { name: "User", role: "—" };
    } catch {
      return { name: "User", role: "—" };
    }
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      setCurrentUser(stored ? JSON.parse(stored) : { name: "User", role: "—" });
    } catch {
      setCurrentUser({ name: "User", role: "—" });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`https://localhost:7000/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      localStorage.removeItem("user");
      setCurrentUser({ name: "User", role: "—" });
      navigate("/login");
    }
  };

  const handleManageUser = async () => {
    navigate("/user-management");
  };


  // --- Overview ---
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState(null);

  // --- Top Endpoints ---
  const [topEndpoints, setTopEndpoints] = useState([]);
  const [topLoading, setTopLoading] = useState(true);
  const [topError, setTopError] = useState(null);

  // --- Errors ---
  const [errorsList, setErrorsList] = useState([]);
  const [errorsLoading, setErrorsLoading] = useState(true);
  const [errorsError, setErrorsError] = useState(null);

  // --- Recent Requests ---
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/overview`, OPTS)
      .then((r) => r.json())
      .then((data) => setOverview(data))
      .catch(() => setOverviewError("Failed to load overview."))
      .finally(() => setOverviewLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/top-endpoints`, OPTS)
      .then((r) => r.json())
      .then((data) => setTopEndpoints(Array.isArray(data) ? data : []))
      .catch(() => setTopError("Failed to load top endpoints."))
      .finally(() => setTopLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/errors`, OPTS)
      .then((r) => r.json())
      .then((data) => setErrorsList(Array.isArray(data) ? data : []))
      .catch(() => setErrorsError("Failed to load error summary."))
      .finally(() => setErrorsLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/recent-requests`, OPTS)
      .then((r) => r.json())
      .then((data) => setRecentRequests(Array.isArray(data) ? data : []))
      .catch(() => setRecentError("Failed to load recent requests."))
      .finally(() => setRecentLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Top Bar */}
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

        {/* Logged-in User + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            onClick={() => setShowProfile(true)}
            title="View profile"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#f9fafb", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "6px 14px",
              cursor: "pointer"
            }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#111827", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700
            }}>
              {(currentUser.name || "User").split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.2 }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.2 }}>{currentUser.role}</div>
            </div>
          </div>

          <button
            onClick={handleManageUser}
            style={{
              padding: "7px 14px", fontSize: 12, fontWeight: 600,
              background: "#fff", color: "#374151",
              border: "1px solid #e5e7eb", borderRadius: 7,
              cursor: "pointer", transition: "all 0.15s"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#f9fafb"; e.target.style.borderColor = "#d1d5db"; }}
            onMouseLeave={(e) => { e.target.style.background = "#fff"; e.target.style.borderColor = "#e5e7eb"; }}
          >
            Manage User
          </button>


          <button
            onClick={handleLogout}
            style={{
              padding: "7px 14px", fontSize: 12, fontWeight: 600,
              background: "#fff", color: "#374151",
              border: "1px solid #e5e7eb", borderRadius: 7,
              cursor: "pointer", transition: "all 0.15s"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#f9fafb"; e.target.style.borderColor = "#d1d5db"; }}
            onMouseLeave={(e) => { e.target.style.background = "#fff"; e.target.style.borderColor = "#e5e7eb"; }}
          >
            Logout
          </button>




        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Real-time API performance overview</p>
        </div>

        {/* Section 1: Overview */}
        <SectionHeader title="Overview" />
        <SectionWrapper loading={overviewLoading} error={overviewError}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <StatCard label="Total Requests" value={overview?.totalRequests ?? "—"} />
            <StatCard label="Avg Response Time" value={overview?.avgResponseTime ?? "—"} unit="ms" />
            <StatCard label="Total Errors" value={overview?.totalErrors ?? "—"} />
            <StatCard label="Error Rate" value={overview?.errorRate != null ? `${overview.errorRate}%` : "—"} />
            <StatCard label="Total Endpoints" value={overview?.totalEndpoints ?? "—"} />
          </div>
        </SectionWrapper>

        {/* Section 2: Top Endpoints */}
        <SectionHeader title="Top Endpoints" />
        <SectionWrapper loading={topLoading} error={topError}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <Table
              columns={["Endpoint", "Method", "Total Requests", "Avg Response Time", "Error Count"]}
              rows={topEndpoints}
              renderRow={(row, i) => (
                <tr key={row._id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <TD><code style={{ fontSize: 12, color: "#1d4ed8" }}>{row.endpoint}</code></TD>
                  <TD><MethodBadge method={row.method} /></TD>
                  <TD>{row.totalRequests}</TD>
                  <TD>{Number(row.avgResponseTime).toFixed(1)} ms</TD>
                  <TD style={{ color: row.errorCount > 10 ? "#dc2626" : "#374151", fontWeight: row.errorCount > 10 ? 600 : 400 }}>
                    {row.errorCount}
                  </TD>
                </tr>
              )}
            />
          </div>
        </SectionWrapper>

        {/* Section 3: Error Summary */}
        <SectionHeader title="Error Summary by Endpoint" />
        <SectionWrapper loading={errorsLoading} error={errorsError}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <Table
              columns={["Endpoint", "Method", "Total Requests", "Error Count", "Error Rate"]}
              rows={errorsList}
              renderRow={(row, i) => {
                const rate = Math.round((row.errorCount / row.totalRequests) * 100);
                return (
                  <tr key={row._id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <TD><code style={{ fontSize: 12, color: "#1d4ed8" }}>{row.endpoint}</code></TD>
                    <TD><MethodBadge method={row.method} /></TD>
                    <TD>{row.totalRequests}</TD>
                    <TD style={{ color: "#dc2626", fontWeight: 600 }}>{row.errorCount}</TD>
                    <TD>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, maxWidth: 80, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${rate}%`, height: "100%", background: rate >= 60 ? "#dc2626" : "#f59e0b", borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: "#374151" }}>{rate}%</span>
                      </div>
                    </TD>
                  </tr>
                );
              }}
            />
          </div>
        </SectionWrapper>

        {/* Section 4: Recent Requests */}
        <SectionHeader title="Recent Requests" />
        <SectionWrapper loading={recentLoading} error={recentError}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <Table
              columns={["Timestamp", "Endpoint", "Method", "Status Code", "Response Time"]}
              rows={recentRequests}
              renderRow={(row, i) => (
                <tr key={row._id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <TD style={{ color: "#6b7280", fontSize: 12, whiteSpace: "nowrap" }}>{formatTime(row.timestamp)}</TD>
                  <TD><code style={{ fontSize: 12, color: "#1d4ed8" }}>{row.endpoint}</code></TD>
                  <TD><MethodBadge method={row.method} /></TD>
                  <TD>
                    <span style={{ fontWeight: 600, fontSize: 12, color: STATUS_COLOR(row.statusCode) }}>
                      {row.statusCode}
                    </span>
                  </TD>
                  <TD>{row.responseTime} ms</TD>
                </tr>
              )}
            />
          </div>
        </SectionWrapper>

      </main>

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}