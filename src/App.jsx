import { useState, useRef, useEffect, useCallback } from "react";

// ─── Theme ───
const T = {
  bg: "#080c14", card: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.06)",
  accent: "#38bdf8", accentSoft: "#38bdf820", purple: "#a78bfa", purpleSoft: "#a78bfa20",
  green: "#34d399", greenSoft: "#34d39920", amber: "#fbbf24", amberSoft: "#fbbf2420",
  text: "#f0f6fc", textMuted: "#8b949e", textDim: "rgba(139,148,158,0.5)",
  danger: "#f87171", inputBg: "rgba(255,255,255,0.04)", inputBorder: "rgba(255,255,255,0.1)",
  inputFocus: "#38bdf860", font: "'Outfit', sans-serif", fontBody: "'IBM Plex Sans', sans-serif",
};

// ─── Dummy Data ───
const DUMMY_APPS = [
  { id: "NC-CON-2026-48231", name: "Rajesh Kumar", aadhaar: "XXXX XXXX 5678", pan: "ABCDE1234F", phone: "+91 98765 43210", address: "123, 4th Cross, JP Nagar, Bengaluru 560078", company: "Sri Lakshmi Enterprises", ref: "REF-0042", bank: "SBI - XXXXXXX1234", udyam: "UDYAM-KA-01-0012345", gst: null, date: "2026-02-28", status: "pending" },
  { id: "NC-CON-2026-39102", name: "Priya Sharma", aadhaar: "XXXX XXXX 9012", pan: "FGHIJ5678K", phone: "+91 87654 32109", address: "45, MG Road, Mysuru 570001", company: "Bharati Textiles", ref: "REF-0039", bank: "HDFC - XXXXXXX5678", udyam: null, gst: "29ABCDE1234F1Z5", date: "2026-03-01", status: "pending" },
  { id: "NC-CON-2026-51784", name: "Arun Gowda", aadhaar: "XXXX XXXX 3456", pan: "KLMNO9012P", phone: "+91 76543 21098", address: "78, Bull Temple Rd, Basavanagudi, Bengaluru 560019", company: "Gowda Farm Products", ref: "REF-0051", bank: "Canara - XXXXXXX9012", udyam: "UDYAM-KA-02-0098765", gst: "29KLMNO9012P1Z8", date: "2026-03-03", status: "pending" },
];

const PREV_CONNECTOR_APP = {
  id: "NC-CON-2026-48231", name: "Rajesh Kumar", phone: "+91 98765 43210",
  date: "2026-02-28", status: "pending",
};

// ─── Shared Components ───
const PageShell = ({ children, step, totalSteps, onBack, backLabel }) => (
  <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 20% 80%, #0a1628 0%, ${T.bg} 50%, #010409 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.fontBody, position: "relative", overflow: "hidden" }}>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
    <style>{`
      @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%{opacity:.08;transform:scale(1)}100%{opacity:.18;transform:scale(1.1)}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes checkPop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
      @keyframes shimmer{0%,100%{opacity:.4}50%{opacity:1}}
      input:focus,textarea:focus{outline:none;border-color:${T.inputFocus}!important;box-shadow:0 0 0 3px ${T.accentSoft}!important;}
      input::placeholder,textarea::placeholder{color:${T.textDim};}
      ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:rgba(255,255,255,.02);border-radius:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:3px}
    `}</style>
    <div style={{ position:"absolute",top:"-8%",left:"-4%",width:380,height:380,borderRadius:"50%",background:"#38bdf8",filter:"blur(90px)",opacity:.1,animation:"pulse 5s ease-in-out infinite alternate",pointerEvents:"none" }} />
    <div style={{ position:"absolute",top:"55%",left:"78%",width:300,height:300,borderRadius:"50%",background:"#a78bfa",filter:"blur(90px)",opacity:.1,animation:"pulse 6s ease-in-out infinite alternate",pointerEvents:"none" }} />
    <div style={{ position:"absolute",inset:0,opacity:.04,backgroundImage:"linear-gradient(rgba(56,189,248,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.4) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none" }} />
    {onBack && (
      <button onClick={onBack} style={{ position:"fixed",top:20,left:20,zIndex:100,display:"flex",alignItems:"center",gap:8,padding:"10px 18px 10px 14px",background:"rgba(255,255,255,.04)",border:`1px solid ${T.cardBorder}`,borderRadius:10,color:T.textMuted,fontFamily:T.font,fontWeight:500,fontSize:13,cursor:"pointer",transition:"all .25s",backdropFilter:"blur(12px)" }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.color=T.text;e.currentTarget.style.borderColor="rgba(255,255,255,.12)"}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.color=T.textMuted;e.currentTarget.style.borderColor=T.cardBorder}}>
        <span style={{fontSize:16}}>←</span> {backLabel || "Home"}
      </button>
    )}
    <div style={{ position:"relative",zIndex:1,width:"100%",maxWidth:580,padding:"0 20px",animation:"fadeUp .7s ease-out" }}>
      {step !== undefined && totalSteps && (
        <div style={{ display:"flex",gap:6,marginBottom:28,justifyContent:"center" }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} style={{ height: 3, borderRadius: 2, flex: 1, maxWidth: 48, background: i < step ? T.accent : i === step ? `linear-gradient(90deg,${T.accent},${T.purple})` : T.cardBorder, transition: "all .4s ease" }} />
          ))}
        </div>
      )}
      {children}
    </div>
  </div>
);

const Brand = ({ small }) => (
  <div style={{ textAlign: "center", marginBottom: small ? 24 : 40 }}>
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: small ? 40 : 52, height: small ? 40 : 52, borderRadius: 12, background: "linear-gradient(135deg,#38bdf8,#818cf8)", boxShadow: "0 8px 28px rgba(56,189,248,.2)", marginBottom: small ? 10 : 16 }}>
      <span style={{ fontSize: small ? 16 : 22, color: "#fff", fontWeight: 700, fontFamily: T.font }}>N</span>
    </div>
    {!small && <h1 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 26, color: T.text, margin: "0 0 4px", letterSpacing: "-.02em" }}>Navachetana</h1>}
  </div>
);

const Btn = ({ children, onClick, disabled, variant = "primary", color, style: s = {}, full }) => {
  const [hov, setHov] = useState(false);
  const c = color || T.accent;
  const base = variant === "primary"
    ? { background: disabled ? `${c}25` : hov ? `linear-gradient(135deg,${c},#6366f1)` : `linear-gradient(135deg,${c},${c}dd)`, color: "#fff", border: "none", boxShadow: hov && !disabled ? `0 12px 40px -8px ${c}40` : "none" }
    : variant === "outline"
    ? { background: hov ? `${c}12` : "transparent", color: c, border: `1.5px solid ${hov ? c : c + "50"}` }
    : { background: hov ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.03)", color: T.textMuted, border: `1px solid ${T.cardBorder}` };
  return (
    <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, padding: "13px 24px", borderRadius: 12, cursor: disabled ? "not-allowed" : "pointer", transition: "all .35s cubic-bezier(.16,1,.3,1)", transform: hov && !disabled ? "translateY(-2px)" : "none", opacity: disabled ? .45 : 1, width: full ? "100%" : "auto", letterSpacing: ".01em", ...base, ...s }}>
      {children}
    </button>
  );
};

const Input = ({ label, placeholder, value, onChange, type = "text", required, icon, disabled }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontFamily: T.font, fontSize: 11, fontWeight: 500, color: T.textMuted, marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>{label} {required && <span style={{ color: T.danger }}>*</span>}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, opacity: .5 }}>{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} disabled={disabled} style={{ width: "100%", boxSizing: "border-box", padding: icon ? "11px 14px 11px 40px" : "11px 14px", background: disabled ? "rgba(255,255,255,.02)" : T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, color: disabled ? T.textMuted : T.text, fontFamily: T.fontBody, fontSize: 14, transition: "all .25s ease", opacity: disabled ? .6 : 1 }} />
    </div>
  </div>
);

const Card = ({ children, style: s = {} }) => (
  <div style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: 24, ...s }}>{children}</div>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending: { bg: T.amberSoft, border: T.amber + "30", color: T.amber, label: "Under Review" },
    approved: { bg: T.greenSoft, border: T.green + "30", color: T.green, label: "Approved" },
    sent_back: { bg: "rgba(248,113,113,.08)", border: "rgba(248,113,113,.25)", color: T.danger, label: "Sent Back" },
  };
  const m = map[status] || map.pending;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, background: m.bg, border: `1px solid ${m.border}`, fontSize: 11, fontWeight: 600, fontFamily: T.font, color: m.color, letterSpacing: ".03em" }}>● {m.label}</span>;
};

// ─── LOGIN ───
const LoginPage = ({ onSelect }) => {
  const [hov, setHov] = useState(null);
  const RoleCard = ({ id, icon, title, sub, color }) => (
    <button onClick={() => onSelect(id)} onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov(null)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "34px 18px", background: hov === id ? `linear-gradient(160deg,${color}15,${color}06,transparent)` : T.card, border: `1px solid ${hov === id ? color + "55" : T.cardBorder}`, borderRadius: 16, cursor: "pointer", transition: "all .4s cubic-bezier(.16,1,.3,1)", transform: hov === id ? "translateY(-4px)" : "none", boxShadow: hov === id ? `0 20px 50px -12px ${color}28` : "0 4px 16px rgba(0,0,0,.2)", position: "relative", overflow: "hidden" }}>
      {hov === id && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${color},transparent)`, animation: "shimmer 1.5s ease-in-out infinite" }} />}
      <div style={{ width: 56, height: 56, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${color}20,${color}08)`, border: `1px solid ${color}30`, fontSize: 26, transition: "transform .3s", transform: hov === id ? "scale(1.08)" : "scale(1)" }}>{icon}</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 17, color: hov === id ? T.text : "#c9d1d9", transition: "color .3s" }}>{title}</div>
        <div style={{ fontFamily: T.fontBody, fontSize: 12, color: T.textDim, marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, color: hov === id ? color : T.textDim, letterSpacing: ".06em", textTransform: "uppercase", transition: "all .3s", display: "flex", alignItems: "center", gap: 4 }}>Continue <span style={{ display: "inline-block", transform: hov === id ? "translateX(4px)" : "none", transition: "transform .3s" }}>→</span></div>
    </button>
  );
  return (
    <PageShell>
      <Brand />
      <p style={{ textAlign: "center", fontSize: 14, color: T.textDim, marginBottom: 30 }}>Select your role to continue</p>
      <div style={{ display: "flex", gap: 14 }}>
        <RoleCard id="connector" icon="⚡" title="Connector" sub="Field ops & client connections" color={T.accent} />
        <RoleCard id="ops" icon="📊" title="Ops Manager" sub="Reports & analytics" color={T.purple} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
        <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
        <span style={{ fontSize: 11, color: T.textDim, fontFamily: T.font, letterSpacing: ".06em" }}>OR</span>
        <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
      </div>
      <RoleCard id="login" icon="🔐" title="Login" sub="Already a connector? Sign in here" color={T.green} />
      <p style={{ textAlign: "center", marginTop: 36, fontSize: 11, color: T.textDim }}>Navachetana Livelihoods · Internal Portal</p>
    </PageShell>
  );
};

// ─── GOOGLE AUTH (reusable) ───
const GoogleAuthPage = ({ onDone, onBack, role }) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const handleClick = () => { setLoading(true); setTimeout(() => { setLoading(false); setDone(true); setTimeout(onDone, 700); }, 1600); };
  return (
    <PageShell onBack={onBack} step={role === "ops" ? 0 : 0} totalSteps={role === "ops" ? 2 : 6}>
      <Brand small />
      <Card>
        <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 20, color: T.text, margin: "0 0 6px", textAlign: "center" }}>Sign in with Google</h2>
        <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center", margin: "0 0 24px", lineHeight: 1.6 }}>Verify your identity to continue as {role === "ops" ? "Operations Manager" : "Connector"}</p>
        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.greenSoft, border: "2px solid " + T.green, display: "inline-flex", alignItems: "center", justifyContent: "center", animation: "checkPop .4s ease-out", marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>✓</span>
            </div>
            <p style={{ color: T.green, fontFamily: T.font, fontWeight: 500, fontSize: 14 }}>Authenticated</p>
          </div>
        ) : (
          <button onClick={handleClick} disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "13px 20px", background: "#fff", border: "1px solid #dadce0", borderRadius: 12, cursor: loading ? "wait" : "pointer", transition: "all .25s", boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
            {loading ? <div style={{ width: 20, height: 20, border: "2.5px solid #dadce0", borderTopColor: "#4285f4", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> : (
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
            )}
            <span style={{ fontFamily: T.fontBody, fontSize: 15, fontWeight: 500, color: "#3c4043" }}>{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>
        )}
      </Card>
    </PageShell>
  );
};

// ─── MOBILE AUTH ───
const MobileAuthPage = ({ onDone, onBack }) => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const sendOtp = () => { if (phone.length >= 10) setOtpSent(true); };
  const handleOtp = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) refs[i + 1].current?.focus();
    if (n.every(d => d)) { setVerifying(true); setTimeout(onDone, 1300); }
  };
  return (
    <PageShell onBack={onBack} step={1} totalSteps={6}>
      <Brand small />
      <Card>
        <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 20, color: T.text, margin: "0 0 6px", textAlign: "center" }}>Mobile Verification</h2>
        <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center", margin: "0 0 22px" }}>OTP will be sent to verify your number</p>
        {!otpSent ? (
          <>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ padding: "11px 14px", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, color: T.textMuted, fontSize: 14, fontFamily: T.fontBody }}>+91</div>
              <div style={{ flex: 1 }}><Input label="Mobile Number" placeholder="Enter 10-digit number" value={phone} onChange={setPhone} type="tel" required /></div>
            </div>
            <Btn onClick={sendOtp} disabled={phone.length < 10} full style={{ marginTop: 4 }}>Send OTP</Btn>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center", marginBottom: 18 }}>OTP sent to +91 {phone.slice(0, 2)}****{phone.slice(-2)}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
              {otp.map((d, i) => <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => handleOtp(i, e.target.value)} onKeyDown={e => { if (e.key === "Backspace" && !d && i > 0) refs[i - 1].current?.focus() }} style={{ width: 46, height: 54, textAlign: "center", fontSize: 22, fontWeight: 600, fontFamily: T.font, background: T.inputBg, border: `1px solid ${d ? T.accent + "60" : T.inputBorder}`, borderRadius: 12, color: T.text, transition: "all .25s", caretColor: T.accent }} />)}
            </div>
            {verifying && <div style={{ textAlign: "center" }}><div style={{ width: 20, height: 20, border: `2.5px solid ${T.cardBorder}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 8px" }} /><p style={{ fontSize: 13, color: T.accent }}>Verifying...</p></div>}
          </>
        )}
      </Card>
    </PageShell>
  );
};

// ─── DATA ENTRY ───
const DataEntryPage = ({ onDone, onBack }) => {
  const [form, setForm] = useState({ aadhaar: "", pan: "", name: "", address: "", company: "", refNumber: "" });
  const [aadhaarExtracted, setAadhaarExtracted] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const extractAadhaar = () => { if (form.aadhaar.length >= 4) { setAadhaarExtracted(true); setForm(p => ({ ...p, name: "Rajesh Kumar", address: "123, 4th Cross, JP Nagar, Bengaluru 560078" })); } };
  const valid = form.aadhaar && form.pan && form.name && form.address && form.company && form.refNumber;
  const InfoChip = ({ icon, label, value }) => (
    <div style={{ padding: "8px 12px", background: T.greenSoft, border: `1px solid ${T.green}25`, borderRadius: 8, marginTop: 6 }}>
      <div style={{ fontSize: 10, color: T.green, fontFamily: T.font, fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 3 }}>{icon} {label}</div>
      <div style={{ fontSize: 13, color: T.text, fontFamily: T.fontBody }}>{value}</div>
    </div>
  );
  return (
    <PageShell onBack={onBack} step={2} totalSteps={6}>
      <Brand small />
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <Card style={{ flex: 1, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: T.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🪪</div>
            <div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.text }}>Aadhaar Card</div>
              <div style={{ fontSize: 11, color: T.textDim }}>12-digit identity number</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}><Input label="Aadhaar Number" placeholder="XXXX XXXX XXXX" value={form.aadhaar} onChange={v => set("aadhaar", v)} required /></div>
            <button onClick={extractAadhaar} style={{ padding: "10px 14px", marginBottom: 16, background: T.accentSoft, border: `1px solid ${T.accent}30`, borderRadius: 10, color: T.accent, fontFamily: T.font, fontWeight: 500, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>Extract</button>
          </div>
          {aadhaarExtracted && (
            <>
              <InfoChip icon="👤" label="Name" value="Rajesh Kumar" />
              <InfoChip icon="📍" label="Address" value="123, 4th Cross, JP Nagar, Bengaluru 560078" />
            </>
          )}
        </Card>
        <Card style={{ flex: 1, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: T.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📄</div>
            <div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.text }}>PAN Card</div>
              <div style={{ fontSize: 11, color: T.textDim }}>Permanent account number</div>
            </div>
          </div>
          <Input label="PAN Number" placeholder="ABCDE1234F" value={form.pan} onChange={v => set("pan", v)} required />
        </Card>
      </div>
      <Card>
        <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 20, color: T.text, margin: "0 0 6px" }}>Personal Details</h2>
        <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 22px" }}>Enter your contact & work details</p>
        <Input label="Full Name" placeholder="Auto-extracted from ID" value={form.name} onChange={v => set("name", v)} required icon="👤" />
        <Input label="Current Address" placeholder="Full residential address" value={form.address} onChange={v => set("address", v)} required icon="📍" />
        <Input label="Current Working Company" placeholder="Company name" value={form.company} onChange={v => set("company", v)} required icon="🏢" />
        <Input label="Reference Number" placeholder="Enter reference number" value={form.refNumber} onChange={v => set("refNumber", v)} required icon="🔗" />
        <Btn onClick={onDone} disabled={!valid} full style={{ marginTop: 6 }}>Submit & Continue</Btn>
      </Card>
    </PageShell>
  );
};

// ─── DOCUMENTATION ───
const DocumentationPage = ({ onDone, onBack }) => {
  const [docs, setDocs] = useState({ aadhaar: null, pan: null, bank: null, udyam: null, gst: null });
  const toggle = (k) => setDocs(p => ({ ...p, [k]: p[k] ? null : `${k}_doc.pdf` }));
  const mandatory = docs.aadhaar && docs.pan && docs.bank;
  const DocSlot = ({ id, label, req, icon }) => (
    <div onClick={() => toggle(id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: docs[id] ? T.greenSoft : T.inputBg, border: `1px solid ${docs[id] ? T.green + "25" : T.inputBorder}`, borderRadius: 12, cursor: "pointer", transition: "all .3s", marginBottom: 8 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: docs[id] ? T.greenSoft : T.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{docs[id] ? "✓" : icon}</div>
      <div style={{ flex: 1 }}><div style={{ fontFamily: T.font, fontWeight: 500, fontSize: 14, color: T.text }}>{label} {req && <span style={{ fontSize: 10, color: T.danger, fontWeight: 600 }}>REQUIRED</span>}</div><div style={{ fontSize: 12, color: docs[id] ? T.green : T.textDim, marginTop: 1 }}>{docs[id] || "Tap to upload"}</div></div>
      <span style={{ fontSize: 16, color: docs[id] ? T.green : T.textDim }}>{docs[id] ? "✓" : "+"}</span>
    </div>
  );
  return (
    <PageShell onBack={onBack} step={3} totalSteps={6}>
      <Brand small />
      <Card>
        <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 20, color: T.text, margin: "0 0 6px" }}>Documentation</h2>
        <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 20px" }}>Upload your documents for verification</p>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10, fontFamily: T.font }}>Mandatory</p>
        <DocSlot id="aadhaar" label="Aadhaar Card" req icon="🪪" /><DocSlot id="pan" label="PAN Card" req icon="📄" /><DocSlot id="bank" label="Banking Details" req icon="🏦" />
        <div style={{ height: 1, background: T.cardBorder, margin: "16px 0" }} />
        <p style={{ fontSize: 11, fontWeight: 600, color: T.purple, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10, fontFamily: T.font }}>Optional</p>
        <DocSlot id="udyam" label="Udyam Certificate" icon="🏭" /><DocSlot id="gst" label="GST Certificate" icon="📋" />
        <Btn onClick={onDone} disabled={!mandatory} full style={{ marginTop: 14 }}>Next →</Btn>
      </Card>
    </PageShell>
  );
};

// ─── E-AGREEMENT ───
const EAgreementPage = ({ onDone, onBack }) => {
  const [scrolled, setScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef(null);
  const handleScroll = useCallback(() => { const el = scrollRef.current; if (el && (el.scrollTop + el.clientHeight >= el.scrollHeight - 20)) setScrolled(true); }, []);
  const lines = [
    "E-AGREEMENT — NAVACHETANA LIVELIHOODS", "",
    "This Connector Agreement ('Agreement') is entered into between Navachetana Livelihoods Pvt. Ltd. ('Company') and the undersigned individual ('Connector').", "",
    "1. SCOPE OF ENGAGEMENT", "The Connector shall act as an independent facilitator, assisting in identifying potential borrowers, collecting documentation, and facilitating loan applications within the assigned territory.", "",
    "2. RESPONSIBILITIES", "2.1 Comply with all applicable RBI guidelines and NBFC-MFI regulations.", "2.2 Conduct due diligence on prospective borrowers and verify documentation.", "2.3 All client information is confidential and proprietary to the Company.", "",
    "3. COMPENSATION", "3.1 Commission as per the prevailing rate card.", "3.2 Payments processed within 15 business days of loan disbursement.", "3.3 Disputes resolved through the Company's grievance mechanism.", "",
    "4. CODE OF CONDUCT", "4.1 No coercive recovery practices.", "4.2 Maintain transparency with borrowers regarding terms.", "4.3 No direct money collection from borrowers.", "",
    "5. CONFIDENTIALITY", "All data accessed during engagement shall be kept strictly confidential, during and after the term.", "",
    "6. TERMINATION", "6.1 Either party may terminate with 30 days written notice.", "6.2 Immediate termination for misconduct, fraud, or violations.", "",
    "7. GOVERNING LAW", "This Agreement shall be governed by the laws of India. Courts of Bengaluru shall have exclusive jurisdiction.", "",
    "By proceeding, you acknowledge that you have read, understood, and agree to all terms and conditions.",
  ];
  return (
    <PageShell onBack={onBack} step={4} totalSteps={6}>
      <Brand small />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 12px" }}>
          <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 20, color: T.text, margin: "0 0 4px" }}>E-Agreement</h2>
          <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>Scroll to the bottom to proceed</p>
        </div>
        <div ref={scrollRef} onScroll={handleScroll} style={{ height: 240, overflowY: "auto", margin: "0 24px", padding: "16px", background: "rgba(0,0,0,.25)", borderRadius: 10, border: `1px solid ${T.cardBorder}` }}>
          {lines.map((l, i) => <p key={i} style={{ fontFamily: T.fontBody, fontSize: l.startsWith("E-AGREE") ? 13 : l.match(/^\d+\./) && !l.match(/^\d+\.\d/) ? 12.5 : 12, fontWeight: l.startsWith("E-AGREE") ? 700 : l.match(/^\d+\./) && !l.match(/^\d+\.\d/) ? 600 : 400, color: l.startsWith("E-AGREE") ? T.text : l.match(/^\d+\./) && !l.match(/^\d+\.\d/) ? "#c9d1d9" : T.textMuted, margin: l === "" ? "6px 0" : "3px 0", lineHeight: 1.7 }}>{l || "\u00A0"}</p>)}
        </div>
        {!scrolled && <div style={{ textAlign: "center", padding: "10px 0 0" }}><span style={{ fontSize: 11, color: T.textDim, fontFamily: T.font }}>↓ Scroll down to continue</span></div>}
        <div style={{ padding: "16px 24px 22px" }}>
          <label onClick={scrolled ? () => setAgreed(!agreed) : undefined} style={{ display: "flex", alignItems: "center", gap: 12, cursor: scrolled ? "pointer" : "not-allowed", opacity: scrolled ? 1 : .3, transition: "opacity .4s", marginBottom: 16 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${agreed ? T.accent : T.inputBorder}`, background: agreed ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .25s", flexShrink: 0 }}>{agreed && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}</div>
            <span style={{ fontFamily: T.fontBody, fontSize: 13, color: T.textMuted }}>I agree to all terms and conditions</span>
          </label>
          <Btn onClick={onDone} disabled={!agreed} full>Proceed to Verification</Btn>
        </div>
      </Card>
    </PageShell>
  );
};

// ─── AADHAAR OTP ───
const AadhaarOtpPage = ({ onDone, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  useEffect(() => { const t = setTimeout(() => setSent(true), 1100); return () => clearTimeout(t); }, []);
  const handleOtp = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) refs[i + 1].current?.focus();
    if (n.every(d => d)) { setVerifying(true); setTimeout(onDone, 1800); }
  };
  return (
    <PageShell onBack={onBack} step={5} totalSteps={6}>
      <Brand small />
      <Card>
        <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 20, color: T.text, margin: "0 0 6px", textAlign: "center" }}>Aadhaar Verification</h2>
        <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center", margin: "0 0 4px" }}>OTP sent to Aadhaar-linked mobile</p>
        <p style={{ fontSize: 12, color: T.accent, textAlign: "center", margin: "0 0 24px" }}>XXXX XXXX 5678</p>
        {!sent ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}><div style={{ width: 22, height: 22, border: `2.5px solid ${T.cardBorder}`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 10px" }} /><p style={{ fontSize: 13, color: T.textMuted }}>Sending OTP...</p></div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 22 }}>
              {otp.map((d, i) => <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => handleOtp(i, e.target.value)} onKeyDown={e => { if (e.key === "Backspace" && !d && i > 0) refs[i - 1].current?.focus() }} style={{ width: 46, height: 54, textAlign: "center", fontSize: 22, fontWeight: 600, fontFamily: T.font, background: T.inputBg, border: `1px solid ${d ? T.accent + "60" : T.inputBorder}`, borderRadius: 12, color: T.text, transition: "all .25s", caretColor: T.accent }} />)}
            </div>
            {verifying && <div style={{ textAlign: "center" }}><div style={{ width: 20, height: 20, border: `2.5px solid ${T.cardBorder}`, borderTopColor: T.green, borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 8px" }} /><p style={{ fontSize: 13, color: T.green }}>Verifying Aadhaar...</p></div>}
            {!verifying && <p style={{ textAlign: "center", fontSize: 12, color: T.textDim }}>Didn't receive? <span style={{ color: T.accent, cursor: "pointer", fontWeight: 500 }}>Resend</span></p>}
          </>
        )}
      </Card>
    </PageShell>
  );
};

// ─── CONNECTOR STATUS PAGE ───
const ConnectorStatusPage = ({ appData, onBack }) => (
  <PageShell onBack={onBack}>
    <div style={{ textAlign: "center", animation: "fadeUp .8s ease-out" }}>
      {appData.status === "approved" ? (
        <>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: `linear-gradient(135deg,${T.greenSoft},${T.accentSoft})`, border: `2px solid ${T.green}40`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24, animation: "checkPop .5s ease-out .2s both", boxShadow: `0 0 60px ${T.green}18` }}>
            <span style={{ fontSize: 38 }}>🎉</span>
          </div>
          <h2 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 24, color: T.text, margin: "0 0 8px" }}>You're Approved!</h2>
          <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 24px" }}>Your connector account has been activated</p>
          <Card style={{ textAlign: "left", marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.green, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 14px", fontFamily: T.font }}>Your Login Credentials</p>
            <div style={{ padding: "14px", background: "rgba(0,0,0,.25)", borderRadius: 10, border: `1px solid ${T.cardBorder}`, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: T.textMuted }}>Connector ID</span>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace", color: T.accent }}>{appData.connectorId || appData.id}</span>
              </div>
              <div style={{ height: 1, background: T.cardBorder, margin: "0 0 10px" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: T.textMuted }}>Temporary Password</span>
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace", color: T.amber }}>Nav@2026tmp</span>
              </div>
            </div>
            <div style={{ padding: "12px 14px", background: T.amberSoft, border: `1px solid ${T.amber}20`, borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
              <p style={{ fontSize: 12, color: T.amber, margin: 0, lineHeight: 1.6 }}>Please change your password immediately after your first login at the portal for security. Navigate to Settings → Security → Change Password.</p>
            </div>
          </Card>
        </>
      ) : appData.status === "sent_back" ? (
        <>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(248,113,113,.08)", border: "2px solid rgba(248,113,113,.25)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24, animation: "checkPop .5s ease-out .2s both" }}>
            <span style={{ fontSize: 38 }}>📝</span>
          </div>
          <h2 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 24, color: T.text, margin: "0 0 8px" }}>Action Required</h2>
          <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 24px" }}>Your application needs some corrections</p>
          <Card style={{ textAlign: "left" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.danger, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 12px", fontFamily: T.font }}>Reason for return</p>
            <div style={{ padding: "14px", background: "rgba(248,113,113,.04)", borderRadius: 10, border: "1px solid rgba(248,113,113,.12)" }}>
              <p style={{ fontSize: 13, color: T.textMuted, margin: 0, lineHeight: 1.7 }}>{appData.sendBackMsg || "Please re-upload your banking details — the account number was unclear. Also verify your address PIN code."}</p>
            </div>
            <Btn onClick={() => {}} full style={{ marginTop: 18 }} color={T.accent}>Edit & Resubmit Application</Btn>
          </Card>
        </>
      ) : (
        <>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: `linear-gradient(135deg,${T.greenSoft},${T.accentSoft})`, border: `2px solid ${T.green}35`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24, animation: "checkPop .5s ease-out .2s both", boxShadow: `0 0 60px ${T.green}15` }}>
            <span style={{ fontSize: 38 }}>✓</span>
          </div>
          <h2 style={{ fontFamily: T.font, fontWeight: 700, fontSize: 24, color: T.text, margin: "0 0 10px" }}>Application Submitted!</h2>
          <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 6px", lineHeight: 1.7 }}>Your details have been forwarded to our team.</p>
          <p style={{ fontSize: 14, color: T.accent, margin: "0 0 28px", fontWeight: 500 }}>We will get back to you shortly.</p>
          <Card style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📋</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.text }}>Reference</div>
                <div style={{ fontSize: 12, color: T.textMuted, fontFamily: "monospace", marginTop: 1 }}>{appData.id}</div>
              </div>
              <StatusBadge status={appData.status} />
            </div>
            <div style={{ padding: "10px 14px", background: T.accentSoft, borderRadius: 8, border: `1px solid ${T.accent}12` }}>
              <p style={{ fontSize: 12, color: T.textMuted, margin: 0, lineHeight: 1.7 }}>Review typically takes 2–3 business days. Updates will be sent to your registered mobile and email.</p>
            </div>
          </Card>
        </>
      )}
      <p style={{ marginTop: 28, fontSize: 11, color: T.textDim }}>Navachetana Livelihoods · Connector Onboarding</p>
    </div>
  </PageShell>
);

// ─── CONNECTOR LANDING ───
const ConnectorLandingPage = ({ existingApp, onNewApp, onViewApp, onBack }) => {
  const [hov, setHov] = useState(null);
  return (
    <PageShell onBack={onBack}>
      <Brand small />
      <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 22, color: T.text, margin: "0 0 6px", textAlign: "center" }}>Welcome back</h2>
      <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center", margin: "0 0 28px" }}>You have an existing application on file</p>
      <div onClick={onViewApp} onMouseEnter={() => setHov("ex")} onMouseLeave={() => setHov(null)} style={{ padding: "18px 20px", background: hov === "ex" ? `linear-gradient(160deg,${T.accent}10,transparent)` : T.card, border: `1px solid ${hov === "ex" ? T.accent + "40" : T.cardBorder}`, borderRadius: 14, cursor: "pointer", transition: "all .35s", marginBottom: 14, transform: hov === "ex" ? "translateY(-2px)" : "none", boxShadow: hov === "ex" ? `0 12px 36px -8px ${T.accent}20` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: T.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📋</div>
            <div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 15, color: T.text }}>{existingApp.name}</div>
              <div style={{ fontSize: 12, fontFamily: "monospace", color: T.textMuted, marginTop: 2 }}>{existingApp.id}</div>
            </div>
          </div>
          <StatusBadge status={existingApp.status} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "rgba(0,0,0,.2)", borderRadius: 8 }}>
          <span style={{ fontSize: 12, color: T.textDim }}>Submitted {existingApp.date}</span>
          <span style={{ fontSize: 12, color: hov === "ex" ? T.accent : T.textDim, fontWeight: 500, transition: "color .3s" }}>View Details →</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
        <span style={{ fontSize: 11, color: T.textDim, fontFamily: T.font, letterSpacing: ".06em" }}>OR</span>
        <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
      </div>
      <div onClick={onNewApp} onMouseEnter={() => setHov("new")} onMouseLeave={() => setHov(null)} style={{ padding: "20px", background: hov === "new" ? `linear-gradient(160deg,${T.green}10,transparent)` : T.card, border: `1.5px dashed ${hov === "new" ? T.green + "60" : T.cardBorder}`, borderRadius: 14, cursor: "pointer", transition: "all .35s", textAlign: "center", transform: hov === "new" ? "translateY(-2px)" : "none" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>➕</div>
        <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 15, color: hov === "new" ? T.text : "#c9d1d9" }}>Empanel</div>
        <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>Begin a fresh connector empanelment</div>
      </div>
    </PageShell>
  );
};

// ─── OPS: LOGIN CHOICE ───
const OpsLoginChoicePage = ({ onGoogle, onEmployee, onBack }) => {
  const [hov, setHov] = useState(null);
  return (
    <PageShell onBack={onBack} step={0} totalSteps={2}>
      <Brand small />
      <Card>
        <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 20, color: T.text, margin: "0 0 6px", textAlign: "center" }}>Operations Manager</h2>
        <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center", margin: "0 0 24px" }}>Choose your login method</p>
        <button onClick={onGoogle} onMouseEnter={() => setHov("g")} onMouseLeave={() => setHov(null)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 20px", background: "#fff", border: "1px solid #dadce0", borderRadius: 12, cursor: "pointer", transition: "all .25s", boxShadow: hov === "g" ? "0 4px 16px rgba(0,0,0,.12)" : "0 1px 3px rgba(0,0,0,.06)", transform: hov === "g" ? "translateY(-2px)" : "none", marginBottom: 12 }}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
          <span style={{ fontFamily: T.fontBody, fontSize: 15, fontWeight: 500, color: "#3c4043" }}>Continue with Google</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "16px 0" }}>
          <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
          <span style={{ fontSize: 11, color: T.textDim, fontFamily: T.font }}>OR</span>
          <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
        </div>
        <Btn onClick={onEmployee} variant="outline" color={T.purple} full>Login with Employee ID</Btn>
      </Card>
    </PageShell>
  );
};

// ─── OPS: EMPLOYEE ID LOGIN ───
const OpsEmployeeLoginPage = ({ onDone, onBack, onSwitchGoogle }) => {
  const [empId, setEmpId] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = () => { setLoading(true); setTimeout(onDone, 1400); };
  return (
    <PageShell onBack={onBack} step={0} totalSteps={2}>
      <Brand small />
      <Card>
        <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 20, color: T.text, margin: "0 0 6px", textAlign: "center" }}>Ops Manager Login</h2>
        <p style={{ fontSize: 13, color: T.textMuted, textAlign: "center", margin: "0 0 22px" }}>Sign in with your employee credentials</p>
        <Input label="Employee ID" placeholder="e.g. NV-OPS-001" value={empId} onChange={setEmpId} required icon="🔑" />
        <Input label="Password" placeholder="Enter your password" value={pass} onChange={setPass} type="password" required icon="🔒" />
        <Btn onClick={handleLogin} disabled={!empId || !pass || loading} full color={T.purple}>
          {loading ? "Signing in..." : "Login"}
        </Btn>
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
          <span style={{ fontSize: 11, color: T.textDim, fontFamily: T.font }}>OR</span>
          <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
        </div>
        <Btn onClick={onSwitchGoogle} variant="outline" color={T.purple} full>Continue with Google →</Btn>
      </Card>
    </PageShell>
  );
};

// ─── OPS: DASHBOARD ───
const OpsDashboardPage = ({ apps, onSelectApp, onBack }) => {
  const [hov, setHov] = useState(null);
  const pending = apps.filter(a => a.status === "pending");
  const processed = apps.filter(a => a.status !== "pending");
  const AppRow = ({ app }) => (
    <div onClick={() => onSelectApp(app)} onMouseEnter={() => setHov(app.id)} onMouseLeave={() => setHov(null)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: hov === app.id ? "rgba(255,255,255,.04)" : "transparent", borderRadius: 12, cursor: "pointer", transition: "all .3s", marginBottom: 4, border: `1px solid ${hov === app.id ? "rgba(255,255,255,.08)" : "transparent"}` }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: `linear-gradient(135deg,${T.purpleSoft},${T.accentSoft})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.purple, flexShrink: 0 }}>{app.name.charAt(0)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.name}</div>
        <div style={{ fontSize: 12, color: T.textDim, fontFamily: "monospace", marginTop: 2 }}>{app.id}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <StatusBadge status={app.status} />
        <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>{app.date}</div>
      </div>
    </div>
  );
  return (
    <PageShell onBack={onBack} step={1} totalSteps={2}>
      <Brand small />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 22, color: T.text, margin: 0 }}>Applications</h2>
        <div style={{ padding: "6px 14px", borderRadius: 20, background: T.purpleSoft, border: `1px solid ${T.purple}30`, fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.purple }}>{pending.length} pending</div>
      </div>
      {pending.length > 0 && (
        <Card style={{ marginBottom: 14, padding: "14px 10px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.amber, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 6px 8px", fontFamily: T.font }}>Awaiting Review</p>
          {pending.map(a => <AppRow key={a.id} app={a} />)}
        </Card>
      )}
      {processed.length > 0 && (
        <Card style={{ padding: "14px 10px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: T.green, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 6px 8px", fontFamily: T.font }}>Processed</p>
          {processed.map(a => <AppRow key={a.id} app={a} />)}
        </Card>
      )}
    </PageShell>
  );
};

// ─── OPS: APP DETAIL ───
const OpsAppDetailPage = ({ app, onAction, onBack }) => {
  const [action, setAction] = useState(null);
  const [sendMsg, setSendMsg] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleApprove = () => { setProcessing(true); setTimeout(() => onAction(app.id, "approved"), 1200); };
  const handleSendBack = () => { if (!sendMsg.trim()) return; setProcessing(true); setTimeout(() => onAction(app.id, "sent_back", sendMsg), 1200); };

  const Row = ({ label, value, mono }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${T.cardBorder}` }}>
      <span style={{ fontSize: 12, color: T.textDim, flexShrink: 0, minWidth: 90 }}>{label}</span>
      <span style={{ fontSize: 13, color: value && value !== "Not provided" ? T.text : T.textDim, fontFamily: mono ? "monospace" : T.fontBody, textAlign: "right", wordBreak: "break-word", maxWidth: "60%" }}>{value || "—"}</span>
    </div>
  );

  return (
    <PageShell onBack={onBack} backLabel="Back">
      <Brand small />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <h2 style={{ fontFamily: T.font, fontWeight: 600, fontSize: 22, color: T.text, margin: 0 }}>{app.name}</h2>
          <p style={{ fontSize: 12, fontFamily: "monospace", color: T.textMuted, margin: "4px 0 0" }}>{app.id}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <Card style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 6px", fontFamily: T.font }}>Identity</p>
        <Row label="Aadhaar" value={app.aadhaar} mono />
        <Row label="PAN" value={app.pan} mono />
        <Row label="Phone" value={app.phone} mono />
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.purple, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 6px", fontFamily: T.font }}>Details</p>
        <Row label="Address" value={app.address} />
        <Row label="Company" value={app.company} />
        <Row label="Reference" value={app.ref} mono />
        <Row label="Submitted" value={app.date} />
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: T.green, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 6px", fontFamily: T.font }}>Documents</p>
        <Row label="Banking" value={app.bank} mono />
        <Row label="Udyam" value={app.udyam || "Not provided"} mono />
        <Row label="GST" value={app.gst || "Not provided"} mono />
      </Card>

      {app.status === "pending" && !action && (
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <Btn onClick={() => setAction("approve_confirm")} color={T.green} full>✓ Approve</Btn>
          <Btn onClick={() => setAction("sendback_form")} variant="outline" color={T.amber} full style={{ flex: 1 }}>↩ Send Back</Btn>
        </div>
      )}

      {action === "approve_confirm" && !processing && (
        <Card style={{ marginTop: 14, animation: "fadeUp .4s ease-out", border: `1px solid ${T.green}25` }}>
          <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: 15, color: T.text, margin: "0 0 8px" }}>Confirm Approval</p>
          <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 18px", lineHeight: 1.6 }}>This will generate login credentials for <strong style={{ color: T.text }}>{app.name}</strong> and notify them via SMS.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={handleApprove} color={T.green} full>Yes, Approve</Btn>
            <Btn onClick={() => setAction(null)} variant="ghost" style={{ flex: "none" }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {action === "sendback_form" && !processing && (
        <Card style={{ marginTop: 14, animation: "fadeUp .4s ease-out", border: `1px solid ${T.amber}25` }}>
          <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: 15, color: T.text, margin: "0 0 8px" }}>Send Back for Corrections</p>
          <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 14px", lineHeight: 1.6 }}>Tell the applicant exactly what needs to be fixed.</p>
          <textarea value={sendMsg} onChange={e => setSendMsg(e.target.value)} placeholder="e.g. Banking details are unclear, please re-upload. Address is missing PIN code..." rows={4} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 10, color: T.text, fontFamily: T.fontBody, fontSize: 13, resize: "vertical", lineHeight: 1.6 }} />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn onClick={handleSendBack} disabled={!sendMsg.trim()} color={T.amber} full>Send Back</Btn>
            <Btn onClick={() => setAction(null)} variant="ghost" style={{ flex: "none" }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {processing && (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ width: 24, height: 24, border: `2.5px solid ${T.cardBorder}`, borderTopColor: T.green, borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 14, color: T.textMuted, fontFamily: T.font }}>Processing...</p>
        </div>
      )}

      {app.status !== "pending" && (
        <Card style={{ marginTop: 6, background: app.status === "approved" ? T.greenSoft : "rgba(248,113,113,.04)", border: `1px solid ${app.status === "approved" ? T.green + "20" : T.danger + "15"}` }}>
          <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: app.status === "approved" ? T.green : T.amber, margin: "0 0 6px" }}>{app.status === "approved" ? "✓ Approved — Credentials generated & sent" : "↩ Sent back for corrections"}</p>
          {app.status === "approved" && <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>Connector ID: <span style={{ fontFamily: "monospace", color: T.accent }}>{app.connectorId || app.id}</span></p>}
          {app.status === "sent_back" && app.sendBackMsg && <p style={{ fontSize: 12, color: T.textMuted, margin: 0, lineHeight: 1.6 }}>Reason: {app.sendBackMsg}</p>}
        </Card>
      )}
    </PageShell>
  );
};

// ─── Persist helpers ───
const STORAGE_KEY = "navachetana_state";
const loadState = () => { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
const saveState = (s) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {} };

// ═══════════════════════ MAIN APP ═══════════════════════
export default function App() {
  const saved = useRef(loadState()).current;
  const [page, setPageRaw] = useState(saved?.page || "login");
  const [apps, setApps] = useState(saved?.apps || DUMMY_APPS);
  const [selectedApp, setSelectedApp] = useState(saved?.selectedApp || null);
  const [connectorApp, setConnectorApp] = useState(saved?.connectorApp || { ...PREV_CONNECTOR_APP });
  const [hasExistingApp, setHasExistingApp] = useState(saved?.hasExistingApp ?? true);

  const setPage = useCallback((p) => { setPageRaw(p); }, []);

  // Save state on every change
  useEffect(() => {
    saveState({ page, apps, selectedApp, connectorApp, hasExistingApp });
  }, [page, apps, selectedApp, connectorApp, hasExistingApp]);

  const goHome = () => setPage("login");

  // Sync connector app status with main apps array
  const getConnectorApp = () => {
    const found = apps.find(a => a.id === connectorApp.id);
    return found ? { ...connectorApp, status: found.status, sendBackMsg: found.sendBackMsg, connectorId: found.connectorId } : connectorApp;
  };

  const handleOpsAction = (appId, status, msg) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status, sendBackMsg: msg, connectorId: status === "approved" ? `NC-CON-${appId.split("-").pop()}` : undefined } : a));
    setSelectedApp(prev => prev ? { ...prev, status, sendBackMsg: msg, connectorId: status === "approved" ? `NC-CON-${appId.split("-").pop()}` : undefined } : prev);
  };

  switch (page) {
    case "login":
      return <LoginPage onSelect={role => setPage(role === "login" ? "con_google" : role === "connector" ? (hasExistingApp ? "con_landing" : "con_google") : "ops_choice")} />;

    // ─── CONNECTOR ───
    case "con_landing":
      return <ConnectorLandingPage existingApp={getConnectorApp()} onViewApp={() => setPage("con_status")} onNewApp={() => setPage("con_google")} onBack={goHome} />;
    case "con_status":
      return <ConnectorStatusPage appData={getConnectorApp()} onBack={() => setPage("con_landing")} />;
    case "con_google":
      return <GoogleAuthPage role="connector" onDone={() => setPage("con_mobile")} onBack={() => setPage(hasExistingApp ? "con_landing" : "login")} />;
    case "con_mobile":
      return <MobileAuthPage onDone={() => setPage("con_data")} onBack={() => setPage("con_google")} />;
    case "con_data":
      return <DataEntryPage onDone={() => setPage("con_docs")} onBack={() => setPage("con_mobile")} />;
    case "con_docs":
      return <DocumentationPage onDone={() => setPage("con_agree")} onBack={() => setPage("con_data")} />;
    case "con_agree":
      return <EAgreementPage onDone={() => setPage("con_aadhaar_otp")} onBack={() => setPage("con_docs")} />;
    case "con_aadhaar_otp":
      return <AadhaarOtpPage onDone={() => {
        const newId = `NC-CON-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const newApp = { id: newId, name: "Rajesh Kumar", aadhaar: "XXXX XXXX 5678", pan: "ABCDE1234F", phone: "+91 98765 43210", address: "123, 4th Cross, JP Nagar, Bengaluru 560078", company: "Sri Lakshmi Enterprises", ref: "REF-NEW", bank: "SBI - XXXXXXX1234", udyam: null, gst: null, date: "2026-03-04", status: "pending" };
        setApps(prev => [newApp, ...prev]);
        setConnectorApp({ id: newId, name: "Rajesh Kumar", phone: "+91 98765 43210", date: "2026-03-04", status: "pending" });
        setHasExistingApp(true);
        setPage("con_submitted");
      }} onBack={() => setPage("con_agree")} />;
    case "con_submitted":
      return <ConnectorStatusPage appData={getConnectorApp()} onBack={goHome} />;

    // ─── OPS ───
    case "ops_choice":
      return <OpsLoginChoicePage onGoogle={() => setPage("ops_google")} onEmployee={() => setPage("ops_empid")} onBack={goHome} />;
    case "ops_google":
      return <GoogleAuthPage role="ops" onDone={() => setPage("ops_dashboard")} onBack={() => setPage("ops_choice")} />;
    case "ops_empid":
      return <OpsEmployeeLoginPage onDone={() => setPage("ops_dashboard")} onBack={() => setPage("ops_choice")} onSwitchGoogle={() => setPage("ops_google")} />;
    case "ops_dashboard":
      return <OpsDashboardPage apps={apps} onSelectApp={a => { setSelectedApp(a); setPage("ops_detail"); }} onBack={goHome} />;
    case "ops_detail":
      return <OpsAppDetailPage app={apps.find(a => a.id === selectedApp?.id) || selectedApp} onAction={handleOpsAction} onBack={() => setPage("ops_dashboard")} />;

    default: return null;
  }
}
