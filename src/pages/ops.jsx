import { useState } from "react";
import { PageShell, Brand, Card, Btn, Input, StatusBadge, Spinner } from "../components";

// ─── CONNECTOR STATUS PAGE ───
export const ConnectorStatusPage = ({ appData, onBack }) => (
  <PageShell onBack={onBack}>
    <div className="page-shell" style={{ textAlign: "center" }}>
      {appData.status === "approved" ? (
        <>
          <div className="status-icon badge-approved" style={{ animation: "checkPop .5s ease-out .2s both" }}>
            <span style={{ fontSize: 38 }}>&#127881;</span>
          </div>
          <h2 className="section-label" style={{ fontSize: 24 }}>You're Approved!</h2>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Your empanel account has been activated</p>
          <Card>
            <div style={{ textAlign: "left" }}>
              <p className="section-label badge-approved" style={{ textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>
                Your Login Credentials
              </p>
              <div className="credentials-box">
                <div className="detail-row">
                  <span className="detail-label">Empanel ID</span>
                  <span className="detail-value" style={{ fontFamily: "monospace" }}>
                    {appData.connectorId || appData.id}
                  </span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,.06)", margin: "10px 0" }} />
                <div className="detail-row">
                  <span className="detail-label">Temporary Password</span>
                  <span className="detail-value" style={{ fontFamily: "monospace", color: "#fbbf24" }}>
                    Nav@2026tmp
                  </span>
                </div>
              </div>
              <div className="card" style={{ background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.12)", display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", marginTop: 14 }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>&#9888;&#65039;</span>
                <p style={{ fontSize: 12, color: "#fbbf24", margin: 0, lineHeight: 1.6 }}>
                  Please change your password immediately after your first login at the portal for security. Navigate to Settings &rarr; Security &rarr; Change Password.
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : appData.status === "sent_back" ? (
        <>
          <div className="status-icon badge-sent-back" style={{ animation: "checkPop .5s ease-out .2s both" }}>
            <span style={{ fontSize: 38 }}>&#128221;</span>
          </div>
          <h2 className="section-label" style={{ fontSize: 24 }}>Action Required</h2>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Your application needs some corrections</p>
          <Card>
            <div style={{ textAlign: "left" }}>
              <p className="section-label" style={{ color: "#f87171", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>
                Reason for return
              </p>
              <div className="credentials-box" style={{ background: "rgba(248,113,113,.04)", borderColor: "rgba(248,113,113,.12)" }}>
                <p style={{ fontSize: 13, margin: 0, lineHeight: 1.7 }}>
                  {appData.sendBackMsg || "Please re-upload your banking details \u2014 the account number was unclear. Also verify your address PIN code."}
                </p>
              </div>
              <Btn onClick={() => {}} full style={{ marginTop: 18 }}>
                Edit &amp; Resubmit Application
              </Btn>
            </div>
          </Card>
        </>
      ) : (
        <>
          <div className="status-icon badge-approved" style={{ animation: "checkPop .5s ease-out .2s both" }}>
            <span style={{ fontSize: 38 }}>{"\u2713"}</span>
          </div>
          <h2 className="section-label" style={{ fontSize: 24 }}>Application Submitted!</h2>
          <p style={{ fontSize: 14, marginBottom: 6, lineHeight: 1.7 }}>Your details have been forwarded to our team.</p>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 28 }}>We will get back to you shortly.</p>
          <Card>
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div className="app-row-avatar" style={{ borderRadius: 8, fontSize: 16 }}>&#128203;</div>
                <div style={{ flex: 1 }}>
                  <div className="section-label" style={{ fontSize: 13 }}>Reference</div>
                  <div style={{ fontSize: 12, fontFamily: "monospace", marginTop: 1 }}>{appData.id}</div>
                </div>
                <StatusBadge status={appData.status} />
              </div>
              <div className="credentials-box">
                <p style={{ fontSize: 12, margin: 0, lineHeight: 1.7 }}>
                  Review typically takes 2&ndash;3 business days. Updates will be sent to your registered mobile and email.
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
      <p style={{ marginTop: 28, fontSize: 11, opacity: 0.5 }}>Navachetana Livelihoods &middot; Empanel Onboarding</p>
    </div>
  </PageShell>
);

// ─── CONNECTOR LANDING PAGE ───
export const ConnectorLandingPage = ({ existingApp, onNewApp, onViewApp, onBack }) => {
  const [hov, setHov] = useState(null);
  return (
    <PageShell onBack={onBack}>
      <Brand small />
      <h2 className="section-label" style={{ fontSize: 22, textAlign: "center", marginBottom: 6 }}>Welcome back</h2>
      <p style={{ fontSize: 13, textAlign: "center", marginBottom: 28 }}>You have an existing application on file</p>

      {/* Existing app card */}
      <div
        className={`card app-row${hov === "ex" ? " badge-pending" : ""}`}
        onClick={onViewApp}
        onMouseEnter={() => setHov("ex")}
        onMouseLeave={() => setHov(null)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onViewApp()}
        style={{
          cursor: "pointer",
          transition: "all .35s",
          marginBottom: 14,
          padding: "18px 20px",
          minHeight: 44,
          transform: hov === "ex" ? "translateY(-2px)" : "none",
          boxShadow: hov === "ex" ? "0 12px 36px -8px rgba(56,189,248,.12)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="app-row-avatar" style={{ borderRadius: 9, fontSize: 18 }}>&#128203;</div>
            <div>
              <div className="app-row-info" style={{ fontWeight: 600, fontSize: 15 }}>{existingApp.name}</div>
              <div style={{ fontSize: 12, fontFamily: "monospace", marginTop: 2 }}>{existingApp.id}</div>
            </div>
          </div>
          <StatusBadge status={existingApp.status} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(0,0,0,.2)", borderRadius: 8 }}>
          <span style={{ fontSize: 12 }}>Submitted {existingApp.date}</span>
          <span
            className="app-row-status"
            style={{ fontSize: 12, fontWeight: 500, color: hov === "ex" ? "#38bdf8" : undefined, transition: "color .3s" }}
          >
            View Details &rarr;
          </span>
        </div>
      </div>

      {/* OR divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
        <span className="section-label" style={{ fontSize: 11, letterSpacing: ".06em" }}>OR</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
      </div>

      {/* New application card */}
      <div
        className="card"
        onClick={onNewApp}
        onMouseEnter={() => setHov("new")}
        onMouseLeave={() => setHov(null)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onNewApp()}
        style={{
          cursor: "pointer",
          transition: "all .35s",
          textAlign: "center",
          padding: 20,
          minHeight: 44,
          border: hov === "new" ? "1.5px dashed rgba(52,211,153,.4)" : "1.5px dashed rgba(255,255,255,.06)",
          transform: hov === "new" ? "translateY(-2px)" : "none",
          background: hov === "new" ? "rgba(52,211,153,.04)" : undefined,
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>&#10133;</div>
        <div className="section-label" style={{ fontSize: 15 }}>Empanel</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Begin a fresh empanelment</div>
      </div>
    </PageShell>
  );
};

// ─── OPS: LOGIN CHOICE PAGE ───
export const OpsLoginChoicePage = ({ onGoogle, onEmployee, onBack }) => {
  const [hov, setHov] = useState(null);
  return (
    <PageShell onBack={onBack} step={0} totalSteps={2}>
      <Brand small />
      <Card>
        <h2 className="section-label" style={{ fontSize: 20, textAlign: "center", marginBottom: 6 }}>Operations Manager</h2>
        <p style={{ fontSize: 13, textAlign: "center", marginBottom: 24 }}>Choose your login method</p>

        {/* Google sign-in button */}
        <button
          className="btn btn-full"
          onClick={onGoogle}
          onMouseEnter={() => setHov("g")}
          onMouseLeave={() => setHov(null)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "14px 20px",
            background: "#fff",
            border: "1px solid #dadce0",
            borderRadius: 12,
            cursor: "pointer",
            transition: "all .25s",
            width: "100%",
            minHeight: 44,
            boxShadow: hov === "g" ? "0 4px 16px rgba(0,0,0,.12)" : "0 1px 3px rgba(0,0,0,.06)",
            transform: hov === "g" ? "translateY(-2px)" : "none",
            marginBottom: 12,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 500, color: "#3c4043" }}>Continue with Google</span>
        </button>

        {/* OR divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
          <span className="section-label" style={{ fontSize: 11 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
        </div>

        <Btn onClick={onEmployee} variant="outline" color="#a78bfa" full>
          Login with Employee ID
        </Btn>
      </Card>
    </PageShell>
  );
};

// ─── OPS: EMPLOYEE LOGIN PAGE ───
export const OpsEmployeeLoginPage = ({ onDone, onBack, onSwitchGoogle }) => {
  const [empId, setEmpId] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(onDone, 1400);
  };

  return (
    <PageShell onBack={onBack} step={0} totalSteps={2}>
      <Brand small />
      <Card>
        <h2 className="section-label" style={{ fontSize: 20, textAlign: "center", marginBottom: 6 }}>Ops Manager Login</h2>
        <p style={{ fontSize: 13, textAlign: "center", marginBottom: 22 }}>Sign in with your employee credentials</p>

        <Input label="Employee ID" placeholder="e.g. NV-OPS-001" value={empId} onChange={setEmpId} required icon="&#128273;" />
        <Input label="Password" placeholder="Enter your password" value={pass} onChange={setPass} type="password" required icon="&#128274;" />

        <Btn onClick={handleLogin} disabled={!empId || !pass || loading} full color="#a78bfa">
          {loading ? "Signing in..." : "Login"}
        </Btn>

        {/* OR divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
          <span className="section-label" style={{ fontSize: 11 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.06)" }} />
        </div>

        <Btn onClick={onSwitchGoogle} variant="outline" color="#a78bfa" full>
          Continue with Google &rarr;
        </Btn>
      </Card>
    </PageShell>
  );
};

// ─── OPS: DASHBOARD PAGE ───
export const OpsDashboardPage = ({ apps, onSelectApp, onBack }) => {
  const [hov, setHov] = useState(null);
  const pending = apps.filter((a) => a.status === "pending");
  const processed = apps.filter((a) => a.status !== "pending");

  const AppRow = ({ app }) => (
    <div
      className="app-row"
      onClick={() => onSelectApp(app)}
      onMouseEnter={() => setHov(app.id)}
      onMouseLeave={() => setHov(null)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelectApp(app)}
      style={{
        cursor: "pointer",
        transition: "all .3s",
        minHeight: 44,
        background: hov === app.id ? "rgba(255,255,255,.04)" : "transparent",
        borderColor: hov === app.id ? "rgba(255,255,255,.08)" : "transparent",
      }}
    >
      <div className="app-row-avatar">{app.name.charAt(0)}</div>
      <div className="app-row-info">
        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {app.name}
        </div>
        <div style={{ fontSize: 12, fontFamily: "monospace", marginTop: 2 }}>{app.id}</div>
      </div>
      <div className="app-row-status">
        <StatusBadge status={app.status} />
        <div style={{ fontSize: 11, marginTop: 4 }}>{app.date}</div>
      </div>
    </div>
  );

  return (
    <PageShell onBack={onBack} step={1} totalSteps={2}>
      <Brand small />
      <div className="dashboard-header">
        <h2 className="section-label" style={{ fontSize: 22, margin: 0 }}>Applications</h2>
        <div className="pending-count badge">
          {pending.length} pending
        </div>
      </div>

      {pending.length > 0 && (
        <Card style={{ marginBottom: 14, padding: "14px 10px" }}>
          <p className="section-label" style={{ color: "#fbbf24", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 6px 8px" }}>
            Awaiting Review
          </p>
          {pending.map((a) => (
            <AppRow key={a.id} app={a} />
          ))}
        </Card>
      )}

      {processed.length > 0 && (
        <Card style={{ padding: "14px 10px" }}>
          <p className="section-label" style={{ color: "#34d399", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 6px 8px" }}>
            Processed
          </p>
          {processed.map((a) => (
            <AppRow key={a.id} app={a} />
          ))}
        </Card>
      )}
    </PageShell>
  );
};

// ─── OPS: APP DETAIL PAGE ───
export const OpsAppDetailPage = ({ app, onAction, onBack }) => {
  const [action, setAction] = useState(null);
  const [sendMsg, setSendMsg] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleApprove = () => {
    setProcessing(true);
    setTimeout(() => onAction(app.id, "approved"), 1200);
  };

  const handleSendBack = () => {
    if (!sendMsg.trim()) return;
    setProcessing(true);
    setTimeout(() => onAction(app.id, "sent_back", sendMsg), 1200);
  };

  const Row = ({ label, value, mono }) => (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span
        className="detail-value"
        style={{
          fontFamily: mono ? "monospace" : undefined,
          opacity: value && value !== "Not provided" ? 1 : 0.5,
        }}
      >
        {value || "\u2014"}
      </span>
    </div>
  );

  return (
    <PageShell onBack={onBack} backLabel="Back">
      <Brand small />

      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 18 }}>
        <div>
          <h2 className="section-label" style={{ fontSize: 22, margin: 0 }}>{app.name}</h2>
          <p style={{ fontSize: 12, fontFamily: "monospace", margin: "4px 0 0" }}>{app.id}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Identity card */}
      <Card style={{ marginBottom: 14 }}>
        <p className="section-label" style={{ color: "#38bdf8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
          Identity
        </p>
        <Row label="Aadhaar" value={app.aadhaar} mono />
        <Row label="PAN" value={app.pan} mono />
        <Row label="Phone" value={app.phone} mono />
      </Card>

      {/* Details card */}
      <Card style={{ marginBottom: 14 }}>
        <p className="section-label" style={{ color: "#a78bfa", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
          Details
        </p>
        <Row label="Address" value={app.address} />
        <Row label="Company" value={app.company} />
        <Row label="Reference" value={app.ref} mono />
        <Row label="Submitted" value={app.date} />
      </Card>

      {/* Documents card */}
      <Card style={{ marginBottom: 14 }}>
        <p className="section-label" style={{ color: "#34d399", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
          Documents
        </p>
        <Row label="Banking" value={app.bank} mono />
        <Row label="Udyam" value={app.udyam || "Not provided"} mono />
        <Row label="GST" value={app.gst || "Not provided"} mono />
      </Card>

      {/* Action buttons (pending only) */}
      {app.status === "pending" && !action && (
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <Btn onClick={() => setAction("approve_confirm")} color="#34d399" full>
            {"\u2713"} Approve
          </Btn>
          <Btn onClick={() => setAction("sendback_form")} variant="outline" color="#fbbf24" full style={{ flex: 1 }}>
            {"\u21A9"} Send Back
          </Btn>
        </div>
      )}

      {/* Approve confirmation */}
      {action === "approve_confirm" && !processing && (
        <Card style={{ marginTop: 14, animation: "fadeUp .4s ease-out", border: "1px solid rgba(52,211,153,.15)" }}>
          <p className="section-label" style={{ fontSize: 15, marginBottom: 8 }}>Confirm Approval</p>
          <p style={{ fontSize: 13, margin: "0 0 18px", lineHeight: 1.6 }}>
            This will generate login credentials for <strong>{app.name}</strong> and notify them via SMS.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={handleApprove} color="#34d399" full>Yes, Approve</Btn>
            <Btn onClick={() => setAction(null)} variant="ghost" style={{ flex: "none" }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Send back form */}
      {action === "sendback_form" && !processing && (
        <Card style={{ marginTop: 14, animation: "fadeUp .4s ease-out", border: "1px solid rgba(251,191,36,.15)" }}>
          <p className="section-label" style={{ fontSize: 15, marginBottom: 8 }}>Send Back for Corrections</p>
          <p style={{ fontSize: 13, margin: "0 0 14px", lineHeight: 1.6 }}>
            Tell the applicant exactly what needs to be fixed.
          </p>
          <textarea
            value={sendMsg}
            onChange={(e) => setSendMsg(e.target.value)}
            placeholder="e.g. Banking details are unclear, please re-upload. Address is missing PIN code..."
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 14px",
              borderRadius: 10,
              fontSize: 13,
              resize: "vertical",
              lineHeight: 1.6,
              minHeight: 44,
            }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn onClick={handleSendBack} disabled={!sendMsg.trim()} color="#fbbf24" full>Send Back</Btn>
            <Btn onClick={() => setAction(null)} variant="ghost" style={{ flex: "none" }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Processing spinner */}
      {processing && (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <Spinner />
          <p className="section-label" style={{ fontSize: 14, marginTop: 12 }}>Processing...</p>
        </div>
      )}

      {/* Post-action status card */}
      {app.status !== "pending" && (
        <Card
          className={app.status === "approved" ? "badge-approved" : "badge-sent-back"}
          style={{
            marginTop: 6,
            background: app.status === "approved" ? "rgba(52,211,153,.08)" : "rgba(248,113,113,.04)",
            border: app.status === "approved" ? "1px solid rgba(52,211,153,.12)" : "1px solid rgba(248,113,113,.1)",
          }}
        >
          <p
            className="section-label"
            style={{
              fontSize: 13,
              color: app.status === "approved" ? "#34d399" : "#fbbf24",
              marginBottom: 6,
            }}
          >
            {app.status === "approved"
              ? "\u2713 Approved \u2014 Credentials generated & sent"
              : "\u21A9 Sent back for corrections"}
          </p>
          {app.status === "approved" && (
            <p style={{ fontSize: 12, margin: 0 }}>
              Empanel ID: <span style={{ fontFamily: "monospace", color: "#38bdf8" }}>{app.connectorId || app.id}</span>
            </p>
          )}
          {app.status === "sent_back" && app.sendBackMsg && (
            <p style={{ fontSize: 12, margin: 0, lineHeight: 1.6 }}>Reason: {app.sendBackMsg}</p>
          )}
        </Card>
      )}
    </PageShell>
  );
};
