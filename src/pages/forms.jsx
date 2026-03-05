import { useState, useRef, useEffect, useCallback } from "react";
import { PageShell, Brand, Card, Btn, Input, OtpInput, Spinner } from "../components";

/* ─────────────────────────────────────────────
   Agreement full text (constant)
   ───────────────────────────────────────────── */
const AGREEMENT_TXT = [
  "E-AGREEMENT — NAVACHETANA LIVELIHOODS (EMPANEL)", "",
  "This Empanel Agreement ('Agreement') is entered into between Navachetana Livelihoods Pvt. Ltd. ('Company') and the undersigned individual ('Empanel').", "",
  "1. SCOPE OF ENGAGEMENT",
  "The Empanel shall act as an independent facilitator, assisting in identifying potential borrowers, collecting documentation, and facilitating loan applications within the assigned territory.", "",
  "2. RESPONSIBILITIES",
  "2.1 Comply with all applicable RBI guidelines and NBFC-MFI regulations.",
  "2.2 Conduct due diligence on prospective borrowers and verify documentation.",
  "2.3 All client information is confidential and proprietary to the Company.", "",
  "3. COMPENSATION",
  "3.1 Commission as per the prevailing rate card.",
  "3.2 Payments processed within 15 business days of loan disbursement.",
  "3.3 Disputes resolved through the Company's grievance mechanism.", "",
  "4. CODE OF CONDUCT",
  "4.1 No coercive recovery practices.",
  "4.2 Maintain transparency with borrowers regarding terms.",
  "4.3 No direct money collection from borrowers.", "",
  "5. CONFIDENTIALITY",
  "All data accessed during engagement shall be kept strictly confidential, during and after the term.", "",
  "6. TERMINATION",
  "6.1 Either party may terminate with 30 days written notice.",
  "6.2 Immediate termination for misconduct, fraud, or violations.", "",
  "7. GOVERNING LAW",
  "This Agreement shall be governed by the laws of India. Courts of Bengaluru shall have exclusive jurisdiction.", "",
  "By proceeding, you acknowledge that you have read, understood, and agree to all terms and conditions.",
];

/* ═════════════════════════════════════════════
   1. DataEntryPage
   ═════════════════════════════════════════════ */
export const DataEntryPage = ({ onDone, onBack }) => {
  const [form, setForm] = useState({
    aadhaar: "",
    pan: "",
    name: "",
    permanentAddress: "",
    communicationAddress: "",
    company: "",
    refNumber: "",
  });
  const [aadhaarExtracted, setAadhaarExtracted] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const extractAadhaar = () => {
    if (form.aadhaar.length >= 4) {
      setAadhaarExtracted(true);
      setForm((p) => ({
        ...p,
        name: "Rajesh Kumar",
        permanentAddress: "123, 4th Cross, JP Nagar, Bengaluru 560078",
      }));
    }
  };

  const copyPermanentToCommunication = () => {
    setForm((p) => ({ ...p, communicationAddress: p.permanentAddress }));
  };

  const valid =
    form.aadhaar &&
    form.pan &&
    form.name &&
    form.permanentAddress &&
    form.communicationAddress &&
    form.company &&
    form.refNumber;

  return (
    <PageShell onBack={onBack} step={2} totalSteps={6}>
      <Brand small />

      {/* ── Aadhaar + PAN side-by-side (stacks on mobile via CSS) ── */}
      <div className="two-col">
        {/* Left: Aadhaar */}
        <Card>
          <div className="input-group">
            <div className="doc-icon">
              <span role="img" aria-label="aadhaar">
                {"\uD83E\uDEAA"}
              </span>
            </div>
            <div className="doc-info">
              <strong>Aadhaar Card</strong>
              <span>12-digit identity number</span>
            </div>
          </div>

          <div className="input-group">
            <div style={{ flex: 1 }}>
              <Input
                label="Aadhaar Number"
                placeholder="XXXX XXXX XXXX"
                value={form.aadhaar}
                onChange={(v) => set("aadhaar", v)}
                required
              />
            </div>
            <Btn
              onClick={extractAadhaar}
              variant="outline"
              style={{ marginBottom: 16, whiteSpace: "nowrap" }}
            >
              Extract
            </Btn>
          </div>

          {aadhaarExtracted && (
            <>
              <div className="info-chip">
                <span className="doc-icon" role="img" aria-label="name">
                  {"\uD83D\uDC64"}
                </span>
                <div>
                  <span className="doc-status">Name</span>
                  <span>Rajesh Kumar</span>
                </div>
              </div>
              <div className="info-chip">
                <span className="doc-icon" role="img" aria-label="address">
                  {"\uD83D\uDCCD"}
                </span>
                <div>
                  <span className="doc-status">Permanent Address</span>
                  <span>123, 4th Cross, JP Nagar, Bengaluru 560078</span>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Right: PAN */}
        <Card>
          <div className="input-group">
            <div className="doc-icon">
              <span role="img" aria-label="pan">
                {"\uD83D\uDCC4"}
              </span>
            </div>
            <div className="doc-info">
              <strong>PAN Card</strong>
              <span>Permanent account number</span>
            </div>
          </div>

          <Input
            label="PAN Number"
            placeholder="ABCDE1234F"
            value={form.pan}
            onChange={(v) => set("pan", v)}
            required
          />
        </Card>
      </div>

      {/* ── Personal Details ── */}
      <Card>
        <h2>Personal Details</h2>
        <p>Enter your contact &amp; work details</p>

        <Input
          label="Full Name"
          placeholder="Auto-extracted from ID"
          value={form.name}
          onChange={(v) => set("name", v)}
          required
          icon={"\uD83D\uDC64"}
          disabled={aadhaarExtracted}
        />

        <Input
          label="Permanent Address"
          placeholder="Full residential address"
          value={form.permanentAddress}
          onChange={(v) => set("permanentAddress", v)}
          required
          icon={"\uD83D\uDCCD"}
          disabled={aadhaarExtracted}
        />

        <div className="input-group">
          <div style={{ flex: 1 }}>
            <Input
              label="Communication Address"
              placeholder="Full communication address"
              value={form.communicationAddress}
              onChange={(v) => set("communicationAddress", v)}
              required
              icon={"\uD83D\uDCCD"}
            />
          </div>
          <Btn
            onClick={copyPermanentToCommunication}
            variant="outline"
            style={{ marginBottom: 16, whiteSpace: "nowrap" }}
          >
            Same as Permanent
          </Btn>
        </div>

        <Input
          label="Current Working Company"
          placeholder="Company name"
          value={form.company}
          onChange={(v) => set("company", v)}
          required
          icon={"\uD83C\uDFE2"}
        />

        <Input
          label="Reference Number"
          placeholder="Enter reference number"
          value={form.refNumber}
          onChange={(v) => set("refNumber", v)}
          required
          icon={"\uD83D\uDD17"}
        />

        <Btn onClick={onDone} disabled={!valid} full className="btn btn-primary btn-full">
          Submit &amp; Continue
        </Btn>
      </Card>
    </PageShell>
  );
};

/* ═════════════════════════════════════════════
   2. DocumentationPage
   ═════════════════════════════════════════════ */
export const DocumentationPage = ({ onDone, onBack }) => {
  const [docs, setDocs] = useState({
    aadhaar: null,
    pan: null,
    bank: null,
    udyam: null,
    gst: null,
  });

  const toggle = (k) =>
    setDocs((p) => ({ ...p, [k]: p[k] ? null : `${k}_doc.pdf` }));

  const mandatory = docs.aadhaar && docs.pan && docs.bank;

  const DocSlot = ({ id, label, req, icon }) => {
    const uploaded = !!docs[id];
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => toggle(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle(id);
          }
        }}
        className={`doc-slot${uploaded ? " doc-slot-uploaded" : ""}`}
        style={{ minHeight: 48 }}
      >
        <div className="doc-icon">{uploaded ? "\u2713" : icon}</div>
        <div className="doc-info">
          <div>
            {label}{" "}
            {req && (
              <span className="doc-status" style={{ color: "var(--danger, #f87171)" }}>
                REQUIRED
              </span>
            )}
          </div>
          <div className="doc-status">{uploaded ? docs[id] : "Tap to upload"}</div>
        </div>
        <span>{uploaded ? "\u2713" : "+"}</span>
      </div>
    );
  };

  return (
    <PageShell onBack={onBack} step={3} totalSteps={6}>
      <Brand small />
      <Card>
        <h2>Documentation</h2>
        <p>Upload your documents for verification</p>

        <p className="doc-status" style={{ textTransform: "uppercase", letterSpacing: ".08em" }}>
          Mandatory
        </p>
        <DocSlot id="aadhaar" label="Aadhaar Card" req icon={"\uD83E\uDEAA"} />
        <DocSlot id="pan" label="PAN Card" req icon={"\uD83D\uDCC4"} />
        <DocSlot id="bank" label="Banking Details" req icon={"\uD83C\uDFE6"} />

        <hr />

        <p className="doc-status" style={{ textTransform: "uppercase", letterSpacing: ".08em" }}>
          Optional
        </p>
        <DocSlot id="udyam" label="Udyam Certificate" icon={"\uD83C\uDFED"} />
        <DocSlot id="gst" label="GST Certificate" icon={"\uD83D\uDCCB"} />

        <Btn onClick={onDone} disabled={!mandatory} full className="btn btn-primary btn-full">
          Next &rarr;
        </Btn>
      </Card>
    </PageShell>
  );
};

/* ═════════════════════════════════════════════
   3. EAgreementPage
   ═════════════════════════════════════════════ */
export const EAgreementPage = ({ onDone, onBack }) => {
  const [scrolled, setScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setScrolled(true);
    }
  }, []);

  return (
    <PageShell onBack={onBack} step={4} totalSteps={6}>
      <Brand small />
      <Card>
        <h2>E-Agreement</h2>
        <p>Scroll to the bottom to proceed</p>

        <div ref={scrollRef} onScroll={handleScroll} className="agreement-scroll">
          <div className="agreement-text">
            {AGREEMENT_TXT.map((line, i) => {
              const isTitle = line.startsWith("E-AGREE");
              const isSection =
                !isTitle && /^\d+\./.test(line) && !/^\d+\.\d/.test(line);

              return (
                <p
                  key={i}
                  style={{
                    fontWeight: isTitle ? 700 : isSection ? 600 : 400,
                    fontSize: isTitle ? 13 : isSection ? 12.5 : 12,
                    margin: line === "" ? "6px 0" : "3px 0",
                    lineHeight: 1.7,
                  }}
                >
                  {line || "\u00A0"}
                </p>
              );
            })}
          </div>
        </div>

        {!scrolled && (
          <div className="step-dots" style={{ textAlign: "center", padding: "10px 0 0" }}>
            <span style={{ fontSize: 11 }}>
              {"\u2193"} Scroll down to continue
            </span>
          </div>
        )}

        <label
          onClick={scrolled ? () => setAgreed(!agreed) : undefined}
          className="input-group"
          style={{
            cursor: scrolled ? "pointer" : "not-allowed",
            opacity: scrolled ? 1 : 0.3,
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            className={`btn${agreed ? " btn-primary" : ""}`}
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {agreed && "\u2713"}
          </div>
          <span>I agree to all terms and conditions</span>
        </label>

        <Btn onClick={onDone} disabled={!agreed} full className="btn btn-primary btn-full">
          Proceed to Verification
        </Btn>
      </Card>
    </PageShell>
  );
};

/* ═════════════════════════════════════════════
   4. AadhaarOtpPage
   ═════════════════════════════════════════════ */
export const AadhaarOtpPage = ({ onDone, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const t = setTimeout(() => setSent(true), 1100);
    return () => clearTimeout(t);
  }, []);

  const handleOtp = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) refs[i + 1].current?.focus();
    if (next.every((d) => d)) {
      setVerifying(true);
      setTimeout(onDone, 1800);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  const resend = () => {
    setSent(false);
    setOtp(["", "", "", "", "", ""]);
    setVerifying(false);
    setTimeout(() => setSent(true), 1100);
  };

  return (
    <PageShell onBack={onBack} step={5} totalSteps={6}>
      <Brand small />
      <Card>
        <h2 style={{ textAlign: "center" }}>Aadhaar Verification</h2>
        <p style={{ textAlign: "center" }}>OTP sent to Aadhaar-linked mobile</p>
        <p style={{ textAlign: "center", fontSize: 12 }}>XXXX XXXX 5678</p>

        {!sent ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <Spinner />
            <p>Sending OTP...</p>
          </div>
        ) : (
          <>
            <div className="otp-container">
              <OtpInput
                otp={otp}
                refs={refs}
                onChange={handleOtp}
                onKeyDown={handleKeyDown}
              />
            </div>

            {verifying && (
              <div style={{ textAlign: "center" }}>
                <Spinner />
                <p>Verifying Aadhaar...</p>
              </div>
            )}

            {!verifying && (
              <p style={{ textAlign: "center", fontSize: 12 }}>
                Didn't receive?{" "}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={resend}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") resend();
                  }}
                  style={{ cursor: "pointer", fontWeight: 500 }}
                >
                  Resend
                </span>
              </p>
            )}
          </>
        )}
      </Card>
    </PageShell>
  );
};
