import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  Filter,
  Grid2X2,
  HelpCircle,
  LifeBuoy,
  LineChart,
  Lock,
  LogOut,
  Mail,
  Menu,
  Pill,
  Plus,
  Printer,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Stethoscope,
  User,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { alerts, patients, recommendations, reports, reviews, roles } from "./data";

const statusStyles = {
  safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
  switch: "bg-blue-50 text-blue-700 border-blue-200",
  review: "bg-amber-50 text-amber-700 border-amber-200",
  escalated: "bg-violet-50 text-violet-700 border-violet-200",
  critical: "bg-red-50 text-red-700 border-red-200",
  neutral: "bg-slate-50 text-slate-700 border-slate-200",
};

const navItems = [
  ["Dashboard", "/dashboard", ShieldCheck],
  ["Patients", "/patients", User],
  ["Alerts Center", "/alerts", Bell],
  ["Recommendations", "/recommendations", ShieldCheck],
  ["Reviews", "/reviews", ClipboardList],
  ["Reports", "/reports", LineChart],
  ["Settings", "/settings", Settings],
  ["Help", "/help", HelpCircle],
];

const roleProfiles = {
  "Duty Doctor / Medical Officer": {
    tag: "Initial operator",
    description: "Enters patients, checks recommendations, and requests consultant review.",
    nav: ["Dashboard", "Patients", "Alerts Center", "Recommendations", "Reviews", "Help"],
  },
  "Consultant / ID Specialist": {
    tag: "Clinical authority",
    description: "Approves escalations, restricted antibiotics, and emergency override cases.",
    nav: ["Dashboard", "Reviews", "Alerts Center", "Recommendations", "Patients", "Reports", "Help"],
  },
  Admin: {
    tag: "Governance only",
    description: "Manages users, reports, rules, and setup without clinical approval power.",
    nav: ["Dashboard", "Reports", "Settings", "Help"],
  },
};

function useRoute() {
  const [path, setPath] = useState(window.location.pathname === "/" ? "/login" : window.location.pathname);
  const navigate = (to) => {
    window.history.pushState(null, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    if (window.location.pathname === "/") window.history.replaceState(null, "", "/login");
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return { path, navigate };
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getPatient(id, list = patients) {
  return list.find((patient) => patient.id === id) || patients.find((patient) => patient.id === id) || list[0] || patients[0];
}

function getRecommendation(idOrPatientId) {
  return recommendations.find((item) => item.id === idOrPatientId || item.patientId === idOrPatientId) || recommendations[0];
}

function getReview(idOrPatientId) {
  return reviews.find((item) => item.id === idOrPatientId || item.patientId === idOrPatientId) || reviews[0];
}

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-10 w-10 shrink-0 place-items-center bg-blue-600 text-white">
        <div className="absolute inset-x-3 inset-y-1 bg-white" />
        <div className="absolute inset-x-1 inset-y-3 bg-white" />
        <Plus className="relative z-10 h-5 w-5 text-blue-600" strokeWidth={3} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="font-bold text-slate-950">Cityview</p>
          <p className="font-bold text-slate-950">Medical Center</p>
        </div>
      )}
    </div>
  );
}

function ProductMark() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-normal text-slate-950">
        StewardCare <span className="text-teal-500">AMS</span>
      </h1>
      <p className="text-sm text-slate-500">Antimicrobial Stewardship</p>
    </div>
  );
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-blue-650 bg-blue-600 text-white hover:bg-blue-700 border-blue-600",
    outline: "bg-white text-blue-700 hover:bg-blue-50 border-blue-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent",
    soft: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
    critical: "bg-[#D32F2F] text-white hover:bg-[#B71C1C] border-[#D32F2F] shadow-sm shadow-red-200",
    success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
  };
  return (
    <button
      className={cx(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <section className={cx("rounded-lg border border-slate-200 bg-white", className)}>{children}</section>;
}

function Badge({ children, tone = "neutral" }) {
  return <span className={cx("inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold", statusStyles[tone])}>{children}</span>;
}

function Field({ icon: Icon, placeholder, value, onChange, className = "" }) {
  return (
    <label className={cx("flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-500", className)}>
      {Icon && <Icon className="h-4 w-4" />}
      <input className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400" placeholder={placeholder} value={value} onChange={(event) => onChange?.(event.target.value)} />
    </label>
  );
}

function SelectBox({ value, onChange, options, className = "" }) {
  return (
    <label className={cx("flex h-11 items-center rounded-md border border-slate-200 bg-white px-3 text-sm", className)}>
      <select className="w-full bg-transparent text-slate-700 outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function FormControl({ label, hint, children, className = "" }) {
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-bold uppercase tracking-normal text-slate-500">{label}</p>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function Confidence({ value }) {
  const tone = value >= 80 ? "text-emerald-600" : value >= 60 ? "text-blue-600" : value >= 45 ? "text-amber-600" : "text-violet-600";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 rounded-full bg-slate-100">
        <div className={cx("h-2 rounded-full", value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-blue-500" : value >= 45 ? "bg-amber-500" : "bg-violet-500")} style={{ width: `${value}%` }} />
      </div>
      <span className={cx("text-sm font-bold", tone)}>{value}%</span>
    </div>
  );
}

function AppShell({ children, path, navigate, role, onLogout, notificationCount = 3 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const allowedNav = roleProfiles[role]?.nav || roleProfiles[roles[0]].nav;
  const visibleNavItems = navItems.filter(([label]) => allowedNav.includes(label));
  const closeMobileAndNavigate = (href) => {
    navigate(href);
    setMobileOpen(false);
  };
  return (
    <div className="clinical-shell min-h-screen text-slate-900">
      <aside className={cx("fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white transition lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-24 items-center border-b border-slate-200 px-6">
          <Logo />
        </div>
        <nav className="space-y-1 p-4">
          {visibleNavItems.map(([label, href, Icon]) => {
            const active = path === href || (href !== "/dashboard" && path.startsWith(href));
            return (
              <button
                key={href}
                onClick={() => {
                  closeMobileAndNavigate(href);
                }}
                className={cx(
                  "focus-ring flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold transition",
                  active ? "bg-blue-50 text-blue-700 shadow-[inset_3px_0_0_#2563eb]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{label}</span>
                {label === "Alerts Center" && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">12</span>}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <ShieldCheck className="mb-2 h-6 w-6 text-teal-600" />
          <p className="text-sm font-bold">StewardCare AMS</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Evidence-based. Patient-focused. Safer outcomes.</p>
          <button onClick={() => closeMobileAndNavigate("/reports")} className="mt-5 text-sm font-semibold text-blue-700">Learn more</button>
        </div>
      </aside>

      {mobileOpen && <button aria-label="Close menu" className="fixed inset-0 z-20 bg-slate-950/20 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-24 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
          <Button variant="ghost" className="px-3 lg:hidden" aria-label="Open navigation menu" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></Button>
          <div className="hidden border-r border-slate-200 pr-8 md:block"><ProductMark /></div>
          <Field icon={Search} placeholder="Search patients, IDs, diagnoses..." className="max-w-xl flex-1" />
          <div className="ml-auto flex items-center gap-4">
            <button onClick={() => navigate("/alerts")} className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100">
              <Bell className="h-6 w-6" />
              <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">{notificationCount}</span>
            </button>
            <div className="relative">
              {accountOpen && <button aria-label="Close account menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setAccountOpen(false)} />}
              <button
                className="focus-ring flex items-center gap-3 rounded-md p-2 text-left hover:bg-slate-100"
                aria-label="Open account menu for Dr. Sarah Johnson"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                onClick={() => setAccountOpen((open) => !open)}
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">SJ</div>
                <div className="hidden leading-tight md:block">
                  <p className="font-bold">Dr. Sarah Johnson</p>
                  <p className="text-sm text-slate-500">{role || "Infectious Diseases"}</p>
                </div>
                <ChevronDown className={cx("h-4 w-4 text-slate-500 transition", accountOpen && "rotate-180")} />
              </button>
              {accountOpen && (
                <div role="menu" className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 p-4">
                    <p className="font-bold">Dr. Sarah Johnson</p>
                    <p className="mt-1 text-sm text-slate-500">{role || "Infectious Diseases"}</p>
                  </div>
                  <button role="menuitem" className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold hover:bg-slate-50" onClick={() => { setAccountOpen(false); navigate("/settings"); }}>
                    <UserCircle className="h-4 w-4 text-slate-500" /> Profile
                  </button>
                  <button role="menuitem" className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold hover:bg-slate-50" onClick={() => { setAccountOpen(false); navigate("/settings"); }}>
                    <Settings className="h-4 w-4 text-slate-500" /> Account settings
                  </button>
                  <button role="menuitem" className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold hover:bg-slate-50" onClick={() => { setAccountOpen(false); navigate("/help"); }}>
                    <LifeBuoy className="h-4 w-4 text-slate-500" /> Help center
                  </button>
                  <button role="menuitem" className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50" onClick={() => { setAccountOpen(false); onLogout(); }}>
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-7rem)] max-w-[1600px] px-4 py-6 md:px-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">StewardCare AMS provides clinical decision support only. Final decisions are at the discretion of the treating clinician.</footer>
      </div>
    </div>
  );
}

function Login({ navigate, role, setRole }) {
  const [remember, setRemember] = useState(false);
  const [notice, setNotice] = useState("");
  const [authMode, setAuthMode] = useState("Sign In");
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[58%_42%]">
        <section className="relative min-h-[560px] overflow-hidden bg-slate-950 px-6 py-7 text-white sm:min-h-[640px] sm:px-10 lg:min-h-screen">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/landing%20vid.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-slate-950/72" />
          <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col">
            <header className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="relative grid h-10 w-10 shrink-0 place-items-center border border-teal-300/40 bg-blue-600 text-white">
                  <div className="absolute inset-x-3 inset-y-1 bg-white" />
                  <div className="absolute inset-x-1 inset-y-3 bg-white" />
                  <Plus className="relative z-10 h-5 w-5 text-blue-600" strokeWidth={3} />
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-white">StewardCare <span className="text-teal-300">AMS</span></p>
                  <p className="text-sm font-semibold text-slate-400">Antimicrobial Stewardship</p>
                </div>
              </div>
              <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 xl:flex">
                {["About", "Features", "Workflow", "Resources"].map((item) => (
                  <button key={item} onClick={() => setNotice(`${item} section is available after sign in for this demo.`)} className="hover:text-white">{item}</button>
                ))}
              </nav>
            </header>

            <div className="flex flex-1 items-center py-10 lg:py-14">
              <div className="max-w-3xl">
                <h1 className="max-w-2xl text-4xl font-bold leading-[1.04] tracking-normal sm:text-6xl xl:text-7xl">
                  Smarter Stewardship.<br />
                  <span className="text-teal-300">Safer Patients.</span>
                </h1>
                <div className="mt-8 h-1 w-20 rounded-full bg-teal-300" />
                <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
                  Clinical decision support for antimicrobial therapy reviews, escalations, and outcome tracking in one secure workspace.
                </p>
                <div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold text-slate-100 lg:mt-10 lg:gap-6">
                  {[
                    [Users, "Evidence-guided recommendations"],
                    [ShieldCheck, "Optimize therapy confidence"],
                    [LineChart, "Track outcomes and impact"],
                  ].map(([Icon, text]) => (
                    <div key={text} className="flex max-w-48 items-center gap-3 border-r border-white/20 pr-6 last:border-r-0">
                      <Icon className="h-7 w-7 shrink-0 text-teal-300" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5 border-t border-white/15 pt-7 text-sm text-slate-300 sm:grid-cols-4">
              {[["48", "Patients under review"], ["<2m", "Review triage"], ["28", "Recommendations today"], ["92%", "Guideline concordance"]].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-teal-200">{value}</p>
                  <p className="mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold leading-tight">Sign in to your clinical workspace</h2>
              <p className="mt-3 text-slate-500">Access StewardCare AMS and continue patient reviews.</p>
            </div>

            <div className="mb-6 grid rounded-lg border border-slate-200 bg-slate-100 p-1">
              <div className="grid grid-cols-2 gap-1">
                {["Sign In", "Register"].map((item) => (
                  <button key={item} onClick={() => setAuthMode(item)} className={cx("rounded-md px-4 py-2.5 text-sm font-bold transition", authMode === item ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800")}>{item}</button>
                ))}
              </div>
            </div>

            {notice && <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">{notice}</div>}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Hospital email</label>
                <Field icon={Mail} placeholder="you@cityviewmc.org" className="mt-2 h-12 bg-slate-50" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</label>
                  <button onClick={() => setNotice("Password reset instructions queued for the entered account.")} className="text-xs font-bold text-blue-700">Forgot password?</button>
                </div>
                <Field icon={Lock} placeholder="Enter your password" className="mt-2 h-12 bg-slate-50" />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} /> Remember this device</label>

              <Button className="min-h-12 w-full text-base shadow-lg shadow-blue-600/20" onClick={() => navigate("/dashboard")}>
                {authMode === "Register" ? "Create Account" : "Sign In to Dashboard"}
                <ChevronRight className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-4 text-sm text-slate-400"><span className="h-px flex-1 bg-slate-200" />or<span className="h-px flex-1 bg-slate-200" /></div>
              <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}><Lock className="h-4 w-4" /> Sign in with SSO</Button>
            </div>

            <div className="mt-5">
              <p className="mb-1 text-sm font-bold">Select your role</p>
              <p className="mb-3 text-xs leading-5 text-slate-500">For Bangladesh workflow, the duty doctor starts the case and consultants approve high-risk decisions.</p>
              <div className="grid gap-2">
                {roles.map((item) => (
                  <button key={item} onClick={() => setRole(item)} className={cx("focus-ring rounded-md border px-3 py-3 text-left transition", role === item ? "border-blue-600 bg-blue-50 text-blue-900" : "border-slate-200 text-slate-700 hover:border-blue-200")}>
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold">{item}</span>
                      <Badge tone={item === "Admin" ? "neutral" : item === "Consultant / ID Specialist" ? "escalated" : "switch"}>{roleProfiles[item].tag}</Badge>
                    </span>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{roleProfiles[item].description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-6 border-t border-slate-200 pt-5 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Secure Gateway</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" />Verified Access</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PageTitle({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-normal text-slate-950">{title}</h2>
        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, delta, tone = "safe" }) {
  return (
    <Card className={cx("p-5", tone === "critical" && "border-red-200 bg-red-50/30", tone === "review" && "border-amber-200 bg-amber-50/30", tone === "escalated" && "border-violet-200 bg-violet-50/30", tone === "switch" && "border-teal-200 bg-teal-50/30")}>
      <div className="flex items-center gap-5">
        <div className={cx("grid h-14 w-14 place-items-center rounded-full", tone === "critical" ? "bg-red-100 text-red-600" : tone === "review" ? "bg-amber-100 text-amber-600" : tone === "escalated" ? "bg-violet-100 text-violet-600" : tone === "switch" ? "bg-teal-100 text-teal-600" : "bg-blue-100 text-blue-600")}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="mt-1 text-sm text-blue-700">{delta}</p>
        </div>
      </div>
    </Card>
  );
}

function PatientBadge({ patient }) {
  const tone = patient.reviewStatus === "safe" ? "safe" : patient.reviewStatus === "switch" ? "switch" : patient.reviewStatus === "escalated" ? "escalated" : "review";
  return <Badge tone={tone}>{patient.status}</Badge>;
}

function Dashboard({ navigate, role, patientsList = patients }) {
  if (role === "Consultant / ID Specialist") return <ConsultantDashboard navigate={navigate} />;
  if (role === "Admin") return <AdminDashboard navigate={navigate} />;
  return <DutyDoctorDashboard navigate={navigate} patientsList={patientsList} />;
}

function DutyDoctorDashboard({ navigate, patientsList = patients }) {
  const queue = patientsList.slice(0, 5);
  return (
    <>
      <PageTitle
        title="Duty Doctor Dashboard"
        subtitle="Initial patient entry, recommendation review, and consultant escalation."
        actions={<Button onClick={() => navigate("/patients/new")}><Plus className="h-4 w-4" />Add New Patient</Button>}
      />
      <Card className="mb-5 border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-900">
        You can start patient intake and request review. High-risk, low-confidence, restricted antibiotic, or Code Sepsis decisions require consultant approval.
      </Card>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Today's assigned patients" value={`${patientsList.length}`} delta="Duty roster" />
        <StatCard icon={ClipboardList} label="Pending intake / missing data" value="6" delta="Needs completion" tone="review" />
        <StatCard icon={Pill} label="Recommendations awaiting action" value="9" delta="Review before order" tone="switch" />
        <StatCard icon={ShieldCheck} label="Cases escalated to consultant" value="5" delta="Approval required" tone="escalated" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">Today’s Assigned Patients <Badge>{queue.length} visible</Badge></h3>
            <button onClick={() => navigate("/patients")} className="font-semibold text-blue-700">View all</button>
          </div>
          <PatientTable patients={queue} navigate={navigate} compact />
        </Card>
        <div className="grid gap-5">
          <ClinicalPanel title="Quick Actions">
            <div className="grid gap-3">
              <Button className="w-full" onClick={() => navigate("/patients/new")}><Plus className="h-4 w-4" />Add new / transfer patient</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/alerts")}>Open high-priority alerts</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/reviews")}>Request consultant review</Button>
            </div>
          </ClinicalPanel>
          <ClinicalPanel title="Permission Guardrails">
            <List items={["Can enter and update patient facts.", "Can view recommendations and request review.", "Cannot approve high-risk or emergency override decisions alone."]} />
          </ClinicalPanel>
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-1">
          <SectionHeader title="Today's Recommendations" action={() => navigate("/recommendations")} />
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const patient = getPatient(rec.patientId);
              return (
                <button key={rec.id} onClick={() => navigate(`/recommendations/${rec.id}`)} className="w-full rounded-lg border border-slate-200 p-4 text-left hover:border-blue-200 hover:bg-blue-50/30">
                  <div className="flex items-center justify-between gap-3">
                    <div><p className="font-bold">{patient.id} · {patient.ward}</p><p className="text-sm text-slate-600">{patient.diagnosis}</p></div>
                    <Confidence value={rec.confidence} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-blue-700">{rec.status}: {rec.suggested.antimicrobial}</p>
                </button>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader title="Needs Review" action={() => navigate("/reviews")} />
          <div className="space-y-3">
            {reviews.filter((item) => item.status !== "Reviewed").slice(0, 3).map((review) => {
              const patient = getPatient(review.patientId);
              return <button key={review.id} onClick={() => navigate(`/reviews/${review.id}`)} className="flex w-full items-center justify-between rounded-lg border border-amber-200 bg-amber-50/30 p-4 text-left"><span><b>{patient.id}</b><br /><span className="text-sm">{patient.diagnosis}</span></span><Badge tone="review">{review.confidence}%</Badge></button>;
            })}
          </div>
        </Card>
        <Card className="p-5">
          <SectionHeader title="Recent Reports" action={() => navigate("/reports")} />
          {reports.slice(0, 3).map((report) => <div key={report[0]} className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0"><div className="flex items-center gap-3"><FileText className="h-6 w-6 text-slate-500" /><div><p className="font-bold">{report[0]}</p><p className="text-sm text-slate-500">{report[1]}</p></div></div><Badge>{report[4]}</Badge></div>)}
        </Card>
      </div>
    </>
  );
}

function ConsultantDashboard({ navigate }) {
  const escalationQueue = reviews.filter((item) => item.status !== "Reviewed");
  const lowConfidence = reviews.filter((item) => item.confidence < 60);
  return (
    <>
      <PageTitle title="Consultant / ID Dashboard" subtitle="Escalation review, restricted antibiotic approval, and critical-case oversight." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={ClipboardList} label="Escalation queue" value={`${escalationQueue.length}`} delta="Needs decision" tone="review" />
        <StatCard icon={AlertTriangle} label="Critical / Code Sepsis cases" value="3" delta="Immediate review" tone="critical" />
        <StatCard icon={ShieldCheck} label="Low-confidence recommendations" value={`${lowConfidence.length}`} delta="Specialist check" tone="escalated" />
        <StatCard icon={Pill} label="Restricted antibiotic approvals" value="7" delta="Pending approval" tone="switch" />
        <StatCard icon={Users} label="Waiting specialist decision" value="5" delta="Assigned to ID" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <SectionHeader title="Escalation Queue" action={() => navigate("/reviews")} />
          <ReviewTable reviews={escalationQueue} navigate={navigate} />
        </Card>
        <div className="space-y-5">
          <ClinicalPanel title="Specialist Quick Actions">
            <div className="grid gap-3">
              <Button className="w-full" onClick={() => navigate("/reviews")}>Open review queue</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/recommendations")}>Approve or modify recommendation</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate("/alerts")}>Send back for more info</Button>
            </div>
          </ClinicalPanel>
          <ClinicalPanel title="Critical Reasons">
            <List items={["Code Sepsis emergency override", "Resistant organism or restricted drug", "Severe allergy or contraindication", "Transfer case with uncertain history"]} />
          </ClinicalPanel>
        </div>
      </div>
    </>
  );
}

function AdminDashboard({ navigate }) {
  return (
    <>
      <PageTitle title="Admin Dashboard" subtitle="Governance, reporting, and system configuration. Clinical approvals are disabled for this role." />
      <Card className="mb-5 border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
        Admin can configure the prototype and view reports, but cannot create prescriptions, approve recommendations, or operate Code Sepsis.
      </Card>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Users} label="Users and access" value="24" delta="Role managed" />
        <StatCard icon={Settings} label="Clinical rule setup" value="18" delta="Active rules" tone="switch" />
        <StatCard icon={LineChart} label="Local antibiogram data" value="2024" delta="Current dataset" tone="review" />
        <StatCard icon={FileText} label="Reports and audit" value="12" delta="Generated" />
        <StatCard icon={ShieldCheck} label="System configuration" value="Safe" delta="No clinical approval power" tone="escalated" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ClinicalPanel title="Governance Areas">
          <List items={["Manage users and role access", "Maintain hospital-level rules", "Update local resistance data", "Review audit and report history"]} />
        </ClinicalPanel>
        <ClinicalPanel title="Admin Actions">
          <div className="grid gap-3">
            <Button onClick={() => navigate("/settings")}>Open system settings</Button>
            <Button variant="outline" onClick={() => navigate("/reports")}>Open reports</Button>
          </div>
        </ClinicalPanel>
        <ClinicalPanel title="Clinical Access Boundary">
          <List items={["No patient prescribing workflow", "No recommendation approval", "No emergency protocol activation"]} />
        </ClinicalPanel>
      </div>
    </>
  );
}

function SectionHeader({ title, action }) {
  return <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold">{title}</h3>{action && <button onClick={action} className="text-sm font-semibold text-blue-700">View all</button>}</div>;
}

function PatientTable({ patients: list, navigate, compact = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="text-xs text-slate-500">
          <tr className="border-b border-slate-200">
            <th className="py-3">Patient ID</th><th>Name</th><th>Age / Sex</th><th>Ward</th><th>Diagnosis</th><th>Current antimicrobials</th><th>Review status</th><th>Confidence</th><th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((patient) => (
            <tr key={patient.id} className="cursor-pointer border-b border-slate-100 hover:bg-blue-50/40" onClick={() => navigate(`/patients/${patient.id}`)}>
              <td className="py-4 font-bold text-blue-950">{patient.id}</td>
              <td>{patient.name}</td>
              <td>{patient.ageSex}</td>
              <td>{patient.ward}</td>
              <td className={compact ? "max-w-40" : ""}>{patient.diagnosis}</td>
              <td>{patient.therapy}</td>
              <td><PatientBadge patient={patient} /></td>
              <td><Confidence value={patient.confidence} /></td>
              <td><ChevronRight className="h-5 w-5 text-slate-400" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartCard() {
  return (
    <Card className="p-5">
      <h3 className="font-bold">Antibiotic Use <span className="font-normal text-slate-500">(DDD/1000 patient-days)</span></h3>
      <p className="mt-3 text-3xl font-bold">72.4 <span className="text-sm font-semibold text-emerald-600">↓ 8.3%</span></p>
      <svg viewBox="0 0 360 130" className="mt-4 h-36 w-full">
        <path d="M20 98 L65 78 L110 88 L155 68 L200 72 L245 88 L290 82 L340 94" fill="none" stroke="#149a8a" strokeWidth="4" />
        <path d="M20 98 L65 78 L110 88 L155 68 L200 72 L245 88 L290 82 L340 94 L340 120 L20 120 Z" fill="#149a8a" opacity="0.12" />
        {[20, 65, 110, 155, 200, 245, 290, 340].map((x, i) => <circle key={x} cx={x} cy={[98, 78, 88, 68, 72, 88, 82, 94][i]} r="4" fill="#149a8a" />)}
      </svg>
    </Card>
  );
}

function ReviewActivity() {
  return (
    <Card className="p-5">
      <h3 className="font-bold">Review Activity <span className="font-normal text-slate-500">(last 7 days)</span></h3>
      <div className="mt-4 flex items-center gap-8">
        <div className="grid h-32 w-32 place-items-center rounded-full border-[18px] border-blue-500 border-r-emerald-500 border-t-amber-500 border-l-violet-500"><span className="text-center text-sm"><b className="text-xl">128</b><br />Reviews</span></div>
        <div className="space-y-3 text-sm">
          {["Safe to continue 56 (43.8%)", "De-escalate / Switch 38 (29.7%)", "Needs review 24 (18.8%)", "Escalated 10 (7.7%)"].map((item) => <p key={item}>{item}</p>)}
        </div>
      </div>
    </Card>
  );
}

function PatientsPage({ navigate, patientsList = patients, role = roles[0] }) {
  const [query, setQuery] = useState("");
  const [ward, setWard] = useState("All wards");
  const [status, setStatus] = useState("All statuses");
  const [notice, setNotice] = useState("");
  const [viewMode, setViewMode] = useState("List");
  const [page, setPage] = useState(1);
  const filtered = patientsList.filter((patient) => {
    const matchesQuery = `${patient.name} ${patient.id} ${patient.diagnosis}`.toLowerCase().includes(query.toLowerCase());
    const matchesWard = ward === "All wards" || patient.ward === ward;
    const matchesStatus = status === "All statuses" || patient.status === status;
    return matchesQuery && matchesWard && matchesStatus;
  });
  return (
    <>
      <PageTitle
        title="Patients"
        subtitle="Search and review patients receiving antimicrobial therapy"
        actions={role === "Admin" ? <Badge tone="neutral">Read-only admin view</Badge> : <Button onClick={() => navigate("/patients/new")}><Plus className="h-4 w-4" />Add New Patient</Button>}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total patients" value={`${patientsList.length}`} delta="Current workspace" />
        <StatCard icon={Users} label="New today" value="15" delta="↑ 3 from yesterday" tone="switch" />
        <StatCard icon={AlertTriangle} label="Needs review" value="23" delta="↑ 4 from yesterday" tone="review" />
        <StatCard icon={ShieldCheck} label="Escalated" value="8" delta="↑ 2 from yesterday" tone="escalated" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_330px]">
        <div className="space-y-5">
          <Card className="grid gap-3 p-4 md:grid-cols-[1fr_150px_170px_130px]">
            <Field icon={Search} placeholder="Search by name, ID, or diagnosis..." value={query} onChange={setQuery} />
            <SelectBox value={ward} onChange={setWard} options={["All wards", "ICU", "Med Ward", "Surg Ward"]} />
            <SelectBox value={status} onChange={setStatus} options={["All statuses", "Safe to continue", "Consider de-escalation", "Needs review", "Escalated"]} />
            <Button variant="soft" onClick={() => setNotice(`Filters applied: ${ward}, ${status}.`)}><Filter className="h-4 w-4" /> Filters</Button>
          </Card>
          {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">{notice}</div>}
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold">Patient {viewMode} <Badge>{filtered.length} visible</Badge></h3><div className="flex gap-2">{role !== "Admin" && <Button variant="outline" onClick={() => navigate("/patients/new")}><Plus className="h-4 w-4" />Add New Patient</Button>}<Button variant="ghost" onClick={() => setNotice(`${filtered.length} visible patients exported for this demo session.`)}><Download className="h-4 w-4" />Export</Button><Button variant={viewMode === "List" ? "soft" : "ghost"} className="px-3" onClick={() => { setViewMode("List"); setNotice("List view selected."); }}><Menu className="h-4 w-4" /></Button><Button variant={viewMode === "Grid" ? "soft" : "ghost"} className="px-3" onClick={() => { setViewMode("Grid"); setNotice("Grid view selected."); }}><Grid2X2 className="h-4 w-4" /></Button></div></div>
            <PatientTable patients={filtered} navigate={navigate} />
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500"><span>Showing 1-{filtered.length} of {patientsList.length} patients</span><div className="flex gap-2">{[1, 2, 3].map((item) => <Button key={item} variant={page === item ? "outline" : "ghost"} className="h-9 px-3" onClick={() => { setPage(item); setNotice(`Page ${item} selected.`); }}>{item}</Button>)}</div></div>
          </Card>
        </div>
        <RightRail navigate={navigate} patientsList={patientsList} />
      </div>
    </>
  );
}

function RightRail({ navigate, patientsList = patients }) {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h3 className="mb-4 text-lg font-bold">High-priority patients</h3>
        <div className="space-y-3">
          {patientsList.filter((p) => p.confidence < 56).map((patient) => <button key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)} className="w-full rounded-lg border border-amber-200 p-3 text-left hover:bg-amber-50"><p className="font-bold">{patient.id} · {patient.ward}</p><p className="text-sm">{patient.name}, {patient.ageSex}</p><p className="text-sm text-slate-500">{patient.diagnosis}</p></button>)}
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="mb-4 text-lg font-bold">Recently viewed</h3>
        {patientsList.slice(0, 5).map((patient) => <button key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)} className="flex w-full items-center justify-between border-b border-slate-100 py-3 text-left last:border-0"><span><b>{patient.id}</b><br /><span className="text-sm text-slate-500">{patient.name}</span></span><Confidence value={patient.confidence} /></button>)}
      </Card>
    </div>
  );
}

function NewPatientIntakePage({ navigate, onCreatePatient, role = roles[0] }) {
  const [pathway, setPathway] = useState("New Patient / No Records");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: "Unknown patient",
    tempId: `TMP-${Date.now().toString().slice(-5)}`,
    ageSex: "Adult / Unknown",
    chiefComplaint: "Fever with suspected infection",
    ward: "ER",
    temp: "38.4 C",
    bp: "90/58",
    hr: "118",
    rr: "26",
    spo2: "93%",
    allergies: "Unknown",
    currentMeds: "Unknown",
    recentAntibiotics: "Unknown",
    cultureOrdered: "No",
  });
  const [mrn, setMrn] = useState("");
  const [summary, setSummary] = useState("Transfer summary: ceftriaxone started yesterday, blood culture pending, no allergy list attached.");
  const [verified, setVerified] = useState({});
  const extractedFields = [
    ["Prior antibiotics", "Ceftriaxone started at transferring facility"],
    ["Culture status", "Blood culture pending"],
    ["Allergy history", "Not documented"],
    ["Resistance pattern", "No prior organism record found"],
  ];
  const unknowns = [
    ["Allergies", form.allergies === "Unknown" || pathway === "Transferred Patient"],
    ["Prior antibiotics", form.recentAntibiotics === "Unknown"],
    ["Resistance history", pathway !== "Existing EHR Patient"],
    ["Culture ordered", form.cultureOrdered !== "Yes"],
  ];
  const uncertaintyCount = unknowns.filter(([, missing]) => missing).length;
  const confidence = pathway === "Existing EHR Patient" ? 86 : pathway === "Transferred Patient" ? 42 : 35;
  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submitPatient = () => {
    const id = pathway === "Existing EHR Patient" && mrn.trim() ? `P-${mrn.trim()}` : form.tempId;
    const patient = {
      id,
      mrn: mrn.trim() || form.tempId,
      name: form.name || "Unknown patient",
      ageSex: form.ageSex,
      ward: form.ward,
      bed: pathway === "Existing EHR Patient" ? "EHR import" : "Intake",
      diagnosis: form.chiefComplaint,
      infectionType: "Suspected infection",
      therapy: pathway === "Existing EHR Patient" ? "Continue active EHR therapy" : "Conservative empiric therapy pending review",
      status: pathway === "Existing EHR Patient" ? "Safe to continue" : "Escalated",
      confidence,
      allergies: form.allergies === "No" ? "No known drug allergies" : form.allergies === "Yes" ? "Allergy reported - verify details" : "Unknown allergy history",
      admitted: "Intake today",
      daysAdmitted: 0,
      attending: "Dr. Sarah Johnson",
      temp: form.temp,
      hr: form.hr,
      bp: form.bp,
      rr: form.rr,
      spo2: form.spo2,
      reviewStatus: pathway === "Existing EHR Patient" ? "safe" : "escalated",
      lastUpdated: "Just now",
      source: pathway,
      uncertaintyCount,
      currentProblems: [form.chiefComplaint, "Incomplete antimicrobial history", "Epistemic uncertainty escalation"],
      cultures: [["Initial culture order", form.cultureOrdered === "Yes" ? "Ordered" : "Not confirmed", "-", "Intake", form.cultureOrdered === "Yes" ? "Pending" : "Missing"]],
      medications: [[pathway === "Transferred Patient" ? "Prior facility therapy" : "Empiric therapy", "-", "-", "Pending verification", "Intake"]],
      labs: [["Vitals screen", "High priority", "Manual intake", "Now"]],
      timeline: [
        ["Now", pathway, "Patient entered through manual intake workflow."],
        ["Now", "Uncertainty scorer", `${uncertaintyCount} critical history fields require confirmation.`],
        ["Now", "Escalation path", pathway === "Existing EHR Patient" ? "EHR timeline imported." : "Human review required before high-confidence recommendation."],
      ],
    };
    onCreatePatient(patient);
    navigate(`/patients/${patient.id}`);
  };

  return (
    <>
      <PageTitle
        title="New Patient Intake"
        subtitle="Manual entry path for new, transferred, or EHR-linked patients."
        actions={<Button variant="outline" onClick={() => navigate("/patients")}>Back to Patients</Button>}
      />
      {role === "Admin" ? (
        <Card className="border-slate-200 bg-slate-50 p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-slate-500" />
          <h3 className="mt-4 text-xl font-bold">Admin cannot create clinical intake records</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">This role is limited to governance, reports, and configuration. Patient entry must be performed by the Duty Doctor / Medical Officer.</p>
          <Button className="mt-5" onClick={() => navigate("/dashboard")}>Return to admin dashboard</Button>
        </Card>
      ) : (
      <>
      {notice && <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">{notice}</div>}
      <Card className="mb-5 border-amber-200 bg-amber-50 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg font-bold text-amber-950">Epistemic Uncertainty</p>
            <p className="mt-1 text-sm leading-6 text-amber-900">Missing history is treated as a safety signal. The system lowers confidence and routes uncertain cases to human review.</p>
          </div>
          <Badge tone={uncertaintyCount > 1 ? "review" : "safe"}>{uncertaintyCount > 1 ? "Escalate for human review" : "High confidence EHR path"}</Badge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {unknowns.map(([label, missing]) => (
            <div key={label} className={cx("rounded-md border bg-white p-3 text-sm", missing ? "border-amber-200" : "border-emerald-200")}>
              <p className="font-bold">{label}</p>
              <p className={cx("mt-1 font-semibold", missing ? "text-amber-700" : "text-emerald-700")}>{missing ? "Missing / unknown" : "Recorded"}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <Card className="p-5">
          <SectionHeader title="Intake Pathway" />
          <div className="space-y-3">
            {["Existing EHR Patient", "New Patient / No Records", "Transferred Patient"].map((item) => (
              <button key={item} onClick={() => setPathway(item)} className={cx("w-full rounded-lg border p-4 text-left transition", pathway === item ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50")}>
                <p className="font-bold">{item}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {item === "Existing EHR Patient" ? "Import history from available EHR timeline." : item === "Transferred Patient" ? "Parse transfer summary and verify extracted fields." : "Use rapid critical-fields-only intake."}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          {pathway === "Existing EHR Patient" && (
            <ClinicalPanel title="Existing EHR Patient">
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <FormControl label="MRN or national ID" hint="Use this when the patient has a previous record in this hospital network.">
                  <Field icon={Search} placeholder="Search by MRN or national ID..." value={mrn} onChange={setMrn} />
                </FormControl>
                <Button onClick={() => setNotice(mrn ? `EHR timeline found for ${mrn}.` : "Enter an MRN to simulate EHR lookup.")}>Import EHR History</Button>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {["Full timeline available", "Allergy history synced", "Prior resistance checked"].map((item) => <div key={item} className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{item}</div>)}
              </div>
            </ClinicalPanel>
          )}

          {pathway === "Transferred Patient" && (
            <ClinicalPanel title="Transfer Patient Record Import">
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-500" />
                <p className="mt-2 font-bold">Upload discharge summary PDF</p>
                <p className="mt-1 text-sm text-slate-500">Prototype mode: paste summary text below to simulate NLP extraction.</p>
              </div>
              <FormControl label="Transfer summary text" hint="Paste discharge notes, antibiotic history, culture results, or paper-transfer text." className="mt-4">
                <textarea value={summary} onChange={(event) => setSummary(event.target.value)} className="h-24 w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-blue-300" />
              </FormControl>
              <div className="mt-4 grid gap-3">
                {extractedFields.map(([label, value]) => {
                  const isVerified = verified[label];
                  return (
                    <div key={label} className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2"><p className="font-bold">{label}</p><Badge tone="neutral">AI extracted</Badge><Badge tone={isVerified ? "safe" : "review"}>{isVerified ? "Verified" : "Unverified"}</Badge></div>
                        <p className="mt-1 text-sm text-slate-600">{value}</p>
                      </div>
                      <div className="flex gap-2"><Button variant="outline" onClick={() => setNotice(`${label} opened for edit.`)}>Edit</Button><Button variant={isVerified ? "success" : "soft"} onClick={() => setVerified((current) => ({ ...current, [label]: true }))}>Confirm</Button></div>
                    </div>
                  );
                })}
              </div>
            </ClinicalPanel>
          )}

          <ClinicalPanel title="Rapid Critical Fields">
            <div className="grid gap-4 md:grid-cols-2">
              <FormControl label="Patient name">
                <Field placeholder="Patient name or temporary label" value={form.name} onChange={(value) => updateForm("name", value)} />
              </FormControl>
              <FormControl label="Temporary patient ID">
                <Field placeholder="Temporary patient ID" value={form.tempId} onChange={(value) => updateForm("tempId", value)} />
              </FormControl>
              <FormControl label="Age / sex">
                <Field placeholder="Age / sex" value={form.ageSex} onChange={(value) => updateForm("ageSex", value)} />
              </FormControl>
              <FormControl label="Current location / ward">
                <SelectBox value={form.ward} onChange={(value) => updateForm("ward", value)} options={["ER", "ICU", "Med Ward", "Surg Ward"]} />
              </FormControl>
              <FormControl label="Chief complaint" className="md:col-span-2">
                <Field placeholder="Chief complaint" value={form.chiefComplaint} onChange={(value) => updateForm("chiefComplaint", value)} />
              </FormControl>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {[["temp", "Temperature"], ["bp", "Blood pressure"], ["hr", "Heart rate"], ["rr", "Respiratory rate"], ["spo2", "SpO2"]].map(([key, label]) => (
                <FormControl key={key} label={label}>
                  <Field placeholder={label} value={form[key]} onChange={(value) => updateForm(key, value)} />
                </FormControl>
              ))}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <FormControl label="Known allergies">
                <SelectBox value={form.allergies} onChange={(value) => updateForm("allergies", value)} options={["Unknown", "No", "Yes"]} />
              </FormControl>
              <FormControl label="Current medications">
                <SelectBox value={form.currentMeds} onChange={(value) => updateForm("currentMeds", value)} options={["Unknown", "No", "Yes"]} />
              </FormControl>
              <FormControl label="Antibiotics in last 90 days">
                <SelectBox value={form.recentAntibiotics} onChange={(value) => updateForm("recentAntibiotics", value)} options={["Unknown", "No", "Yes"]} />
              </FormControl>
              <FormControl label="Culture collection ordered">
                <SelectBox value={form.cultureOrdered} onChange={(value) => updateForm("cultureOrdered", value)} options={["No", "Yes"]} />
              </FormControl>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <Button variant="outline" onClick={() => setNotice("Draft intake saved for this demo session.")}>Save draft</Button>
              <Button onClick={submitPatient}>Create patient and escalate</Button>
            </div>
          </ClinicalPanel>
        </div>
      </div>
      </>
      )}
    </>
  );
}

function PatientOverview({ id, navigate, patientsList = patients, role = roles[0] }) {
  const patient = getPatient(id, patientsList);
  const [notice, setNotice] = useState("");
  const [emergencyActive, setEmergencyActive] = useState(false);
  const isAdmin = role === "Admin";
  const activateCodeSepsis = () => {
    if (isAdmin) {
      setNotice("Admin cannot operate Code Sepsis or approve clinical decisions.");
      return;
    }
    setEmergencyActive(true);
    setNotice("Code Sepsis activated: emergency override is routing this case to the 1-hour sepsis protocol and notifying the ASP team.");
  };
  return (
    <>
      <PageTitle
        title="Patient Overview"
        subtitle={`Dashboard > Patients > ${patient.id}`}
        actions={<><Button variant="success" onClick={() => navigate(`/patients/${patient.id}/recommendation`)}><ShieldCheck className="h-4 w-4" />View recommendation</Button><Button variant="outline" onClick={() => setNotice(isAdmin ? "Admin cannot add clinical notes." : `Note composer opened for ${patient.id}.`)}><Plus className="h-4 w-4" />Add note</Button><Button onClick={() => isAdmin ? setNotice("Admin cannot request or approve clinical review.") : navigate(`/patients/${patient.id}/review`)}>Request review</Button><Button variant="critical" onClick={activateCodeSepsis}><AlertTriangle className="h-4 w-4" />Code Sepsis</Button></>}
      />
      {notice && <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">{notice}</div>}
      {isAdmin && <Card className="mb-5 border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">Admin view is read-only for patient care. Clinical actions are disabled in this prototype.</Card>}
      {emergencyActive && (
        <Card className="mb-5 border-red-300 bg-red-50 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#D32F2F] text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-red-950">Emergency Override Active</p>
                <p className="mt-1 text-sm leading-6 text-red-900">Routine stewardship checks are paused for this case. The system is prioritizing critical vitals, the IDSA 1-hour sepsis bundle, fatal contraindication screening, and a specialist red alert.</p>
              </div>
            </div>
            <Badge tone="critical">Critical Red Alert sent</Badge>
          </div>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
            {[
              ["Extractor", "Fetches current BP, HR, RR, SpO2, and shock indicators."],
              ["Navigator", "Routes directly to the 1-hour sepsis protocol."],
              ["LTL Gate", "Bypasses routine culture-wait rules; blocks only fatal contraindications."],
              ["HITL Alert", "Notifies ASP and specialist teams for immediate monitoring."],
            ].map(([label, text]) => (
              <div key={label} className="rounded-md border border-red-200 bg-white p-3">
                <p className="font-bold text-red-900">{label}</p>
                <p className="mt-1 leading-5 text-slate-700">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
      {patient.source && (
        <Card className="mb-5 border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2"><p className="text-lg font-bold text-amber-950">{patient.source}</p><Badge tone="review">High uncertainty</Badge><Badge tone="escalated">Human review required</Badge></div>
              <p className="mt-2 text-sm leading-6 text-amber-900">This profile was created through manual intake. Missing allergies, prior antibiotic exposure, or resistance history reduce confidence and force the escalation pathway.</p>
            </div>
            <Confidence value={patient.confidence} />
          </div>
        </Card>
      )}
      <Card className="mb-5 p-5">
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <div className="flex items-center gap-5"><div className="grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-blue-700"><User className="h-11 w-11" /></div><div><h3 className="text-2xl font-bold">{patient.name}</h3><p className="text-slate-500">Patient ID</p><button onClick={() => setNotice(`${patient.id} is already open.`)} className="font-bold text-blue-700">{patient.id}</button></div></div>
          <div className="grid gap-4 md:grid-cols-3">
            <Info label="Age / Sex" value={patient.ageSex} /><Info label="Ward / Bed" value={`${patient.ward} / ${patient.bed}`} /><Info label="Admission date" value={`${patient.admitted} (${patient.daysAdmitted} days)`} />
            <Info label="Primary diagnosis" value={patient.diagnosis} /><Info label="Allergies" value={patient.allergies} alert /><Info label="Attending team" value={`${patient.attending} (ID)`} />
          </div>
        </div>
      </Card>
      <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
        <div className="grid gap-5 lg:grid-cols-2">
          <ClinicalPanel title="Current Problems / Suspected Infection">
            <List items={patient.currentProblems} />
            <div className="mt-4 border-t pt-4 text-sm"><b>Current therapy:</b> {patient.therapy} <Badge tone="switch">Day 3</Badge></div>
          </ClinicalPanel>
          <ClinicalPanel title="Recent Vitals">
            <div className="grid grid-cols-5 gap-2 text-center">
              {[["Temp", patient.temp], ["HR", patient.hr], ["BP", patient.bp], ["RR", patient.rr], ["SpO₂", patient.spo2]].map(([label, value]) => <div key={label} className="rounded-md bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-bold">{value}</p></div>)}
            </div>
          </ClinicalPanel>
          <DataPanel title="Microbiology / Culture Results" rows={patient.cultures} headers={["Specimen", "Result", "Organism", "Collected", "Status"]} />
          <DataPanel title="Key Labs" rows={patient.labs} headers={["Test", "Result", "Ref. range", "Date"]} />
          <DataPanel title="Current Medications" rows={patient.medications} headers={["Medication", "Dose / Route", "Frequency", "Indication", "Start date"]} />
          <ClinicalPanel title="Clinical Timeline">
            <div className="space-y-4">
              {patient.timeline.map(([time, title, note]) => <div key={`${time}-${title}`} className="flex gap-3"><div className="mt-1 h-3 w-3 rounded-full bg-teal-500" /><div><p className="font-bold">{time} · {title}</p><p className="text-sm text-slate-600">{note}</p></div></div>)}
            </div>
          </ClinicalPanel>
        </div>
        <div className="space-y-5">
          <ClinicalPanel title="Safety Alerts">
            {(patient.source ? ["Manual intake: allergy and medication history require confirmation.", "Prior antimicrobial exposure is incomplete.", "Resistance history unknown: escalate to specialist review."] : ["Allergy: avoid penicillins if possible.", "Renal function: consider dose adjustment.", "Duplicate therapy: review concurrent therapy."]).map((item) => <div key={item} className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm"><AlertTriangle className="mb-1 h-5 w-5 text-amber-600" />{item}</div>)}
          </ClinicalPanel>
          <ClinicalPanel title="Care Considerations">
            <List items={["De-escalate when culture results allow", "Consider narrowing to targeted therapy", "Planned 7-day course if clinical improvement continues"]} />
          </ClinicalPanel>
          <ClinicalPanel title="Quick Info">
            <Info label="Code status" value="Full code" /><Info label="Isolation" value="Contact precautions" /><Info label="Lines / Drains" value="ETT, CVC, Foley" /><Info label="Weight" value="78 kg" />
          </ClinicalPanel>
        </div>
      </div>
    </>
  );
}

function Info({ label, value, alert }) {
  return <div className="border-b border-slate-100 py-2 last:border-0"><p className="text-xs font-semibold text-slate-500">{label}</p><p className={cx("font-semibold", alert && "text-red-600")}>{value}</p></div>;
}

function ClinicalPanel({ title, children }) {
  return <Card className="p-5"><SectionHeader title={title} />{children}</Card>;
}

function DataPanel({ title, headers, rows }) {
  return (
    <ClinicalPanel title={title}>
      <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="text-xs text-slate-500"><tr>{headers.map((h) => <th key={h} className="py-2">{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-t border-slate-100">{row.map((cell, i) => <td key={`${cell}-${i}`} className="py-3">{cell === "Final" ? <Badge tone="safe">Final</Badge> : cell === "Pending" ? <Badge tone="review">Pending</Badge> : cell}</td>)}</tr>)}</tbody></table></div>
    </ClinicalPanel>
  );
}

function List({ items }) {
  return <ul className="space-y-3 text-sm">{items.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" /><span>{item}</span></li>)}</ul>;
}

function RecommendationDetail({ id, navigate, role = roles[0] }) {
  const rec = getRecommendation(id);
  const patient = getPatient(rec.patientId);
  const [decision, setDecision] = useState(rec.status);
  const [comment, setComment] = useState("");
  const isAdmin = role === "Admin";
  const needsConsultantApproval = role === "Duty Doctor / Medical Officer" && (rec.confidence < 70 || patient.reviewStatus === "escalated");
  const clinicalActionNotice = isAdmin ? "Admin cannot approve clinical decisions." : "Requires consultant approval for this high-risk recommendation.";
  return (
    <>
      <PageTitle title="Treatment Recommendation" subtitle={`Recommendation ID: ${rec.id}`} actions={<Button variant="outline" onClick={() => navigate(`/patients/${patient.id}`)}>View full profile</Button>} />
      {isAdmin && <Card className="mb-5 border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">Admin view is read-only. Recommendation approval and clinical routing actions are disabled.</Card>}
      <PatientSummary patient={patient} />
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr_330px]">
        <TherapyCard title="Current therapy" therapy={rec.current} badge="Active" />
        <TherapyCard title="Suggested plan" therapy={rec.suggested} badge={decision} highlight />
        <ClinicalPanel title="Recommendation confidence"><div className="grid place-items-center py-8"><div className="text-6xl font-bold">{rec.confidence}%</div><p className="mt-3 font-semibold text-teal-700">High confidence</p><p className="mt-4 text-center text-sm text-slate-600">Based on current evidence, patient data, and local resistance patterns.</p></div></ClinicalPanel>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <ClinicalPanel title="Why this is suggested"><List items={rec.rationale} /></ClinicalPanel>
        <ClinicalPanel title="Culture summary"><p className="text-sm">Klebsiella pneumoniae · 10⁵ CFU/mL</p><div className="mt-4 space-y-2 text-sm"><p>Meropenem <Badge tone="safe">S</Badge></p><p>Piperacillin/Tazobactam <Badge tone="critical">R</Badge></p><p>Ceftazidime <Badge tone="review">I</Badge></p></div></ClinicalPanel>
        <ClinicalPanel title="Safety checks"><List items={rec.safety} /></ClinicalPanel>
        <ClinicalPanel title="Drug interactions"><p className="text-sm leading-6">{rec.interaction}</p></ClinicalPanel>
        <ClinicalPanel title="Renal dose consideration"><p className="text-sm leading-6">{rec.renal}</p></ClinicalPanel>
      </div>
      <Card className="mt-5 p-5">
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <div><p className="font-bold">Expected review date</p><p className="mt-2 text-xl font-bold">May 15, 2024</p><p className="text-sm text-slate-500">Within 48-72 hours</p></div>
          <div>
            {(isAdmin || needsConsultantApproval) && <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{clinicalActionNotice}</div>}
            <label className="text-sm font-semibold">Clinician comments</label>
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} className="mt-2 h-24 w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-blue-300" placeholder="Add your notes or rationale..." />
            <div className="mt-3 flex flex-wrap justify-end gap-3"><Button variant="outline" onClick={() => setDecision(isAdmin ? "Admin read-only" : "Specialist review requested")}>Request specialist review</Button><Button variant="outline" onClick={() => setDecision(isAdmin ? "Admin read-only" : needsConsultantApproval ? "Consultant approval required" : "Modified plan")}>Modify plan</Button><Button variant={isAdmin || needsConsultantApproval ? "soft" : "primary"} onClick={() => setDecision(isAdmin ? "Admin cannot approve clinical decisions" : needsConsultantApproval ? "Requires consultant approval" : "Accepted")}>{isAdmin ? "Admin read-only" : needsConsultantApproval ? "Requires consultant approval" : "Accept recommendation"}</Button></div>
          </div>
        </div>
      </Card>
    </>
  );
}

function PatientSummary({ patient }) {
  return <Card className="p-5"><div className="grid gap-4 md:grid-cols-6"><Info label="Patient ID" value={patient.id} /><Info label="Ward" value={patient.ward} /><Info label="Age / Sex" value={patient.ageSex} /><Info label="Diagnosis" value={patient.diagnosis} /><Info label="Current therapy" value={patient.therapy} /><Info label="Allergies" value={patient.allergies} alert={patient.allergies !== "No known drug allergies"} /></div></Card>;
}

function TherapyCard({ title, therapy, badge, highlight }) {
  return (
    <Card className={cx("p-5", highlight && "border-teal-300 bg-teal-50/20")}>
      <h3 className="mb-4 text-lg font-bold">{title} <Badge tone={highlight ? "safe" : "switch"}>{badge}</Badge></h3>
      {Object.entries(therapy).map(([key, value]) => <div key={key} className="grid grid-cols-2 border-t border-slate-100 py-3 text-sm"><b className="capitalize">{key}</b><span>{value}</span></div>)}
    </Card>
  );
}

function ReviewsPage({ navigate }) {
  const [priority, setPriority] = useState("All");
  const filtered = reviews.filter((review) => priority === "All" || review.priority === priority);
  return (
    <>
      <PageTitle title="Reviews Queue" subtitle="Review and act on flagged antimicrobial cases." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5"><StatCard icon={ClipboardList} label="Pending Reviews" value="28" delta="↑ 6 from yesterday" tone="review" /><StatCard icon={AlertTriangle} label="High Priority" value="9" delta="↑ 2 from yesterday" tone="critical" /><StatCard icon={User} label="Assigned to Me" value="7" delta="— 0 from yesterday" /><StatCard icon={Activity} label="Overdue" value="4" delta="↑ 1 from yesterday" tone="critical" /><StatCard icon={CheckCircle2} label="Completed Today" value="12" delta="↑ 3 from yesterday" tone="safe" /></div>
      <Card className="mt-6 grid gap-3 p-4 md:grid-cols-[1fr_140px_140px_170px_120px]"><Field icon={Search} placeholder="Search by patient, ID, or diagnosis..." /><SelectBox value={priority} onChange={setPriority} options={["All", "High", "Moderate"]} /><SelectBox value="All" onChange={() => {}} options={["All", "Pending review", "In progress", "Escalated"]} /><SelectBox value="All reviewers" onChange={() => {}} options={["All reviewers", "Dr. Johnson", "Dr. Patel"]} /><Button variant="soft"><Filter className="h-4 w-4" />Filters</Button></Card>
      <Card className="mt-5 p-5"><SectionHeader title={`All Reviews (${filtered.length} cases)`} /><ReviewTable reviews={filtered} navigate={navigate} /></Card>
    </>
  );
}

function ReviewTable({ reviews: list, navigate }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="text-xs text-slate-500"><tr className="border-b"><th className="py-3">Case ID</th><th>Patient</th><th>Ward</th><th>Diagnosis</th><th>Review reason</th><th>Confidence</th><th>Assigned reviewer</th><th>Due time</th><th>Status</th></tr></thead><tbody>{list.map((review) => { const patient = getPatient(review.patientId); return <tr key={review.id} onClick={() => navigate(`/reviews/${review.id}`)} className="cursor-pointer border-b border-slate-100 hover:bg-blue-50/40"><td className="py-4 font-bold text-blue-950">{patient.id}</td><td>{patient.name}<br /><span className="text-slate-500">{patient.ageSex}</span></td><td>{patient.ward}</td><td>{patient.diagnosis}</td><td>{review.reason}</td><td><Confidence value={review.confidence} /></td><td>{review.reviewer}</td><td>{review.due}</td><td><Badge tone={review.status === "Escalated" ? "escalated" : review.status === "In progress" ? "switch" : "review"}>{review.status}</Badge></td></tr>; })}</tbody></table></div>;
}

function ReviewDetail({ id, navigate, role = roles[0] }) {
  const review = getReview(id);
  const patient = getPatient(review.patientId);
  const [status, setStatus] = useState(review.status);
  const [note, setNote] = useState("");
  const [reviewer, setReviewer] = useState(review.reviewer);
  const [priority, setPriority] = useState(review.priority);
  const isAdmin = role === "Admin";
  return (
    <>
      <PageTitle title="Escalation Review" subtitle={<button onClick={() => navigate("/reviews")} className="text-blue-700">← Back to Queue</button>} actions={<Badge tone="review">Needs specialist review</Badge>} />
      {isAdmin && <Card className="mb-5 border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">Admin view is read-only. Recommendation approval and clinical routing actions are disabled.</Card>}
      <PatientSummary patient={patient} />
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <ClinicalPanel title="Why this case was flagged"><div className="grid gap-3 md:grid-cols-5">{["Low confidence 48%", "Missing culture result", "Conflicting clinical findings", "Severe infection", "Allergy concern"].map((item) => <div key={item} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold">{item}</div>)}</div></ClinicalPanel>
          <div className="grid gap-5 lg:grid-cols-2">
            <ClinicalPanel title="Missing or needed information">{["Blood culture result", "Respiratory culture and sensitivity", "Procalcitonin or CRP trend", "Renal function trend", "Recent antibiotic history"].map((item, index) => <label key={item} className="flex items-center justify-between border-b py-3 text-sm"><span><input type="checkbox" defaultChecked={index === 4} className="mr-2" />{item}</span><Badge tone={index < 2 ? "critical" : index < 4 ? "review" : "safe"}>{index < 2 ? "High" : index < 4 ? "Medium" : "Low"}</Badge></label>)}</ClinicalPanel>
            <ClinicalPanel title="Recommendation (Draft)"><TherapyCard title="Current suggestion" therapy={{ therapy: patient.therapy, duration: "7 days", rationale: "Broad-spectrum coverage for suspected infection. Clinical improvement noted.", confidence: `${review.confidence}%` }} badge="Pending review" /></ClinicalPanel>
          </div>
          <ClinicalPanel title="Discussion"><div className="space-y-4 text-sm">{["Dr. Sarah Johnson: Patient with persistent fever and increased oxygen needs. Please review current therapy and advise.", "System: Case escalated to Infectious Diseases for specialist review.", `${patient.attending}: Renal function stable. Allergy status reviewed.`].map((item) => <p key={item} className="rounded-lg bg-slate-50 p-3">{item}</p>)}<div className="flex gap-2"><Field placeholder="Type a message..." value={note} onChange={setNote} className="flex-1" /><Button variant={note ? "primary" : "soft"} onClick={() => { if (note.trim()) { setStatus("Message sent"); setNote(""); } }}>Send</Button></div></div></ClinicalPanel>
        </div>
        <div className="space-y-5">
          <ClinicalPanel title="Assign review"><SelectBox value={reviewer} onChange={(value) => { setReviewer(value); setStatus(`Assigned to ${value}`); }} options={["Dr. Michael Anderson", "Dr. Priya Patel", "Dr. James Lee"]} /><div className="mt-4"><SelectBox value={priority} onChange={(value) => { setPriority(value); setStatus(`${value} priority selected`); }} options={["High", "Moderate", "Low"]} /></div><textarea className="mt-4 h-28 w-full rounded-md border border-slate-200 p-3 text-sm outline-none" placeholder="Add notes for the reviewer..." /></ClinicalPanel>
          <ClinicalPanel title="Actions"><div className="space-y-3"><Button className="w-full" variant={isAdmin ? "soft" : "primary"} onClick={() => setStatus(isAdmin ? "Admin cannot request consult" : "Consult requested")}>Request consult</Button><Button variant={isAdmin ? "soft" : "success"} className="w-full" onClick={() => setStatus(isAdmin ? "Admin cannot mark reviewed" : "Reviewed")}>Mark reviewed</Button><Button variant={isAdmin ? "soft" : "danger"} className="w-full" onClick={() => setStatus(isAdmin ? "Admin cannot send clinical case back" : "Needs more info")}>Send back for more info</Button><p className="text-center text-sm font-semibold text-slate-600">Current state: {status}</p></div></ClinicalPanel>
        </div>
      </div>
    </>
  );
}

function AlertsPage({ navigate }) {
  const [tab, setTab] = useState("All Alerts");
  const [sort, setSort] = useState("Newest first");
  const [notice, setNotice] = useState("");
  const [actionOpen, setActionOpen] = useState("");
  const [resolvedIds, setResolvedIds] = useState([]);
  const visible = alerts.filter((alert) => {
    if (tab === "Resolved") return resolvedIds.includes(alert.id);
    return !resolvedIds.includes(alert.id) && (tab === "All Alerts" || alert.category === tab || alert.priority === tab);
  });
  return (
    <>
      <PageTitle title="Alerts Center" subtitle="Important updates and action items requiring your attention" actions={<><Button variant="outline" onClick={() => setNotice(`Showing ${tab.toLowerCase()} sorted by ${sort.toLowerCase()}.`)}><Filter className="h-4 w-4" />Filters</Button><SelectBox value={sort} onChange={setSort} options={["Newest first", "Critical first", "Patient ID"]} /></>} />
      {notice && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">{notice}</div>}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"><StatCard icon={AlertTriangle} label="Critical" value="9" delta="↑ 3 from yesterday" tone="critical" /><StatCard icon={Calendar} label="Due Today" value="17" delta="↑ 5 from yesterday" tone="review" /><StatCard icon={Mail} label="Unread" value="28" delta="↑ 6 from yesterday" /><StatCard icon={CheckCircle2} label="Resolved" value="124" delta="↑ 18 from yesterday" tone="safe" /></div>
      <div className="mt-6 flex flex-wrap rounded-lg border border-slate-200 bg-white p-1">{["All Alerts", "Critical", "Culture Updates", "Review Deadlines", "Recommendation Updates", "Resolved"].map((item) => <button key={item} onClick={() => setTab(item)} className={cx("rounded-md px-5 py-3 text-sm font-semibold", tab === item ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}>{item}</button>)}</div>
      <Card className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-white text-xs text-slate-500"><tr className="border-b"><th className="p-4">Alert</th><th>Patient</th><th>Ward</th><th>Alert Details</th><th>Priority</th><th>Time</th><th>Actions</th></tr></thead>
            <tbody>
              {visible.map((alert) => {
                const patient = getPatient(alert.patientId);
                return (
                  <tr key={alert.id} className="border-b border-slate-100">
                    <td className="p-4"><div className="flex items-center gap-3"><AlertTriangle className={cx("h-7 w-7", alert.priority === "Critical" ? "text-red-600" : "text-amber-600")} /><div><b>{alert.type}</b><p className="text-slate-500">{patient.allergies}</p></div></div></td>
                    <td><b>{patient.id}</b><p className="text-slate-500">{patient.name}, {patient.ageSex}</p></td>
                    <td>{patient.ward}</td>
                    <td>{alert.detail}</td>
                    <td><Badge tone={alert.priority === "Critical" ? "critical" : alert.priority === "High" ? "review" : "switch"}>{resolvedIds.includes(alert.id) ? "Resolved" : alert.priority}</Badge></td>
                    <td>{alert.time}</td>
                    <td>
                      <div className="relative flex gap-2">
                        <Button variant="outline" onClick={() => navigate(`/patients/${patient.id}`)}>View case</Button>
                        <Button variant="ghost" className="px-3" onClick={() => setActionOpen(actionOpen === alert.id ? "" : alert.id)}><ChevronDown className="h-4 w-4" /></Button>
                        {actionOpen === alert.id && (
                          <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                            <button className="w-full px-3 py-2 text-left font-semibold hover:bg-slate-50" onClick={() => navigate(`/patients/${patient.id}/review`)}>Open review</button>
                            <button className="w-full px-3 py-2 text-left font-semibold hover:bg-slate-50" onClick={() => navigate(`/patients/${patient.id}/recommendation`)}>Open recommendation</button>
                            <button className="w-full px-3 py-2 text-left font-semibold text-emerald-700 hover:bg-emerald-50" onClick={() => { setResolvedIds((ids) => [...new Set([...ids, alert.id])]); setActionOpen(""); setNotice(`${alert.type} marked resolved.`); }}>Mark resolved</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function RecommendationsPage({ navigate }) {
  return (
    <>
      <PageTitle title="Recommendations" subtitle="Evidence-based antimicrobial recommendations awaiting action" />
      <Card className="p-5"><PatientTable patients={patients.filter((patient) => recommendations.some((rec) => rec.patientId === patient.id))} navigate={(to) => { const id = to.split("/").pop(); navigate(`/patients/${id}/recommendation`); }} /></Card>
    </>
  );
}

function ReportsPage() {
  const [type, setType] = useState("Case summary");
  const [range, setRange] = useState("May 7, 2024 → May 13, 2024");
  const [notice, setNotice] = useState("");
  return (
    <>
      <PageTitle title="Reports" subtitle="Generate, preview, and export antimicrobial stewardship reports" actions={<><Button variant="outline" onClick={() => setNotice("PDF download queued for presentation demo.")}><FileText className="h-4 w-4" />Download PDF</Button><Button variant="outline" onClick={() => setNotice("CSV export queued for presentation demo.")}><Download className="h-4 w-4" />Export CSV</Button><Button variant="outline" onClick={() => setNotice("Print preview opened for presentation demo.")}><Printer className="h-4 w-4" />Print</Button><Button variant="outline" onClick={() => setNotice("Share link copied for presentation demo.")}><Share2 className="h-4 w-4" />Share</Button></>} />
      {notice && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">{notice}</div>}
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="p-5">
          <SectionHeader title="1. Select Report Type" />
          {["Case summary", "Daily review report", "Ward antimicrobial use", "Monthly stewardship report"].map((item) => <button key={item} onClick={() => setType(item)} className={cx("mb-3 flex w-full items-center justify-between rounded-lg border p-4 text-left", type === item ? "border-blue-500 bg-blue-50" : "border-slate-200")}><span><b>{item}</b><br /><span className="text-sm text-slate-500">Preview report content and outcomes.</span></span><span className={cx("h-4 w-4 rounded-full border", type === item && "border-blue-600 bg-blue-600")} /></button>)}
          <SectionHeader title="2. Filters" />
          <div className="space-y-3"><Field icon={Calendar} value={range} onChange={setRange} /><SelectBox value="All wards" onChange={() => {}} options={["All wards", "ICU", "Med Ward"]} /><SelectBox value="All organisms" onChange={() => {}} options={["All organisms", "Klebsiella", "Pseudomonas"]} /><Button className="w-full" onClick={() => setNotice(`${type} regenerated for ${range}.`)}>Generate Report</Button></div>
        </Card>
        <div className="space-y-5">
          <Card className="p-6">
            <h3 className="text-xl font-bold capitalize">{type} Report</h3><p className="text-slate-500">Antimicrobial Stewardship Program · {range}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-5">{[["Total Cases", 32], ["Recommendations", 28], ["De-escalations", 12], ["Escalations", 5], ["Avg Time", "18.4 hrs"]].map(([label, value]) => <div key={label} className="rounded-lg border border-slate-200 p-4 text-center"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2"><ChartCard /><ReviewActivity /></div>
          </Card>
          <Card className="p-5"><SectionHeader title="4. Previously Generated Reports" /><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><tbody>{reports.map((report) => <tr key={report[0]} className="border-b border-slate-100"><td className="py-3 font-semibold">{report[0]}</td><td>{report[1]}</td><td>{report[2]}</td><td>{report[3]}</td><td>{report[4]}</td><td>{report[5]}</td><td><button onClick={() => setNotice(`${report[0]} download queued.`)} className="rounded-md p-2 text-blue-700 hover:bg-blue-50" aria-label={`Download ${report[0]}`}><Download className="h-4 w-4" /></button></td></tr>)}</tbody></table></div></Card>
        </div>
      </div>
    </>
  );
}

function SettingsPage({ navigate }) {
  const [tab, setTab] = useState("My Settings");
  const [saved, setSaved] = useState("");
  const [email, setEmail] = useState(true);
  const [inApp, setInApp] = useState(true);
  return (
    <>
      <PageTitle title="Settings" subtitle="Configure your preferences, notifications, and team settings" />
      <div className="mb-5 flex flex-wrap gap-2 border-b border-slate-200">{["My Settings", "Team & Access", "Clinical Setup", "System Preferences"].map((item) => <button key={item} onClick={() => setTab(item)} className={cx("px-4 py-3 text-sm font-semibold", tab === item ? "border-b-2 border-blue-600 text-blue-700" : "text-slate-600")}>{item}</button>)}</div>
      {saved && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{saved}</div>}
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <SettingsSection icon={User} title="User Profile" text="Manage your personal information and preferences."><div className="grid gap-3 md:grid-cols-2"><Field value="Dr. Sarah Johnson" onChange={() => {}} /><SelectBox value="Consultant / ID Specialist" onChange={() => {}} options={roles} /><Field value="sarah.johnson@cityviewmc.org" onChange={() => {}} /><SelectBox value="(UTC-05:00) Eastern Time" onChange={() => {}} options={["(UTC-05:00) Eastern Time", "(UTC+06:00) Dhaka"]} /></div></SettingsSection>
          <SettingsSection icon={Bell} title="Notification Preferences" text="Choose how and when you receive alerts."><Toggle label="Email notifications" checked={email} setChecked={setEmail} /><Toggle label="In-app notifications" checked={inApp} setChecked={setInApp} /><Toggle label="High-priority alerts" checked setChecked={() => {}} /></SettingsSection>
          <SettingsSection icon={ClipboardList} title="Review Workflow" text="Set review and escalation preferences."><SelectBox value="Safe to continue" onChange={() => {}} options={["Safe to continue", "Needs review"]} /><SelectBox value="After 24 hours" onChange={() => {}} options={["After 24 hours", "After 48 hours", "After 72 hours"]} /></SettingsSection>
          <SettingsSection icon={Stethoscope} title="Clinical Preferences" text="Customize clinical defaults."><Toggle label="Show generics" checked setChecked={() => {}} /><Toggle label="Include renal dose alerts" checked setChecked={() => {}} /></SettingsSection>
          <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setSaved("Changes discarded.")}>Discard changes</Button><Button onClick={() => setSaved("All settings saved for this demo session.")}>Save all changes</Button></div>
        </div>
        <div className="space-y-5">
          <ClinicalPanel title="Your Account"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full bg-amber-100 font-bold">SJ</div><div><p className="font-bold">Dr. Sarah Johnson</p><p className="text-sm text-slate-500">Consultant / ID Specialist</p></div></div><div className="mt-5"><Info label="Role" value="Clinical authority" /><Info label="Permissions" value="Escalation review and specialist approval" /><Info label="Last sign in" value="May 13, 2024 8:24 AM" /></div></ClinicalPanel>
          <ClinicalPanel title="Quick Links">
            <div className="space-y-2">
              {[
                ["Manage Users", "Team & Access"],
                ["Manage Roles", "Team & Access"],
                ["Configure Wards", "Clinical Setup"],
                ["Escalation Routing", "Clinical Setup"],
                ["Notification Test", "System Preferences"],
              ].map(([label, nextTab]) => (
                <button key={label} onClick={() => { setTab(nextTab); setSaved(`${label} opened.`); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold hover:bg-slate-50">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  {label}
                </button>
              ))}
            </div>
          </ClinicalPanel>
          <ClinicalPanel title="Need Help?"><p className="text-sm text-slate-600">Visit the help center for guides and best practices.</p><Button variant="outline" className="mt-4" onClick={() => navigate("/help")}>Go to Help Center</Button></ClinicalPanel>
        </div>
      </div>
    </>
  );
}

function SettingsSection({ icon: Icon, title, text, children }) {
  return <Card className="grid gap-5 p-5 md:grid-cols-[240px_1fr]"><div className="flex gap-4"><div className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-blue-600"><Icon className="h-6 w-6" /></div><div><p className="font-bold">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div></div><div className="space-y-3">{children}</div></Card>;
}

function Toggle({ label, checked, setChecked }) {
  return <label className="flex items-center justify-between border-b border-slate-100 py-3 text-sm"><span className="font-semibold">{label}</span><button type="button" onClick={() => setChecked(!checked)} className={cx("h-6 w-11 rounded-full p-1 transition", checked ? "bg-teal-600" : "bg-slate-300")}><span className={cx("block h-4 w-4 rounded-full bg-white transition", checked && "translate-x-5")} /></button></label>;
}

function HelpPage({ navigate }) {
  return (
    <>
      <PageTitle
        title="Help Center"
        subtitle="Support resources for StewardCare AMS workflows."
        actions={<Button variant="outline" onClick={() => navigate("/settings")}><Settings className="h-4 w-4" />Back to settings</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        <ClinicalPanel title="Patient Review"><List items={["Open patient records from Patients or Alerts.", "Use recommendations for therapy guidance.", "Request review when clinical confidence is low."]} /></ClinicalPanel>
        <ClinicalPanel title="Recommendations"><List items={["Accept, modify, or escalate each recommendation.", "Add clinician comments before final action.", "Return to full patient profile at any time."]} /></ClinicalPanel>
        <ClinicalPanel title="Account Support"><List items={["Use the account menu for profile and logout.", "Change notification preferences in Settings.", "Contact support for SSO or password reset issues."]} /></ClinicalPanel>
      </div>
    </>
  );
}

function NotFound({ navigate }) {
  return <Card className="mx-auto max-w-xl p-8 text-center"><X className="mx-auto h-10 w-10 text-slate-400" /><h2 className="mt-4 text-2xl font-bold">Page not found</h2><p className="mt-2 text-slate-600">This prototype route is not available.</p><Button className="mt-6" onClick={() => navigate("/dashboard")}>Return to dashboard</Button></Card>;
}

export default function App() {
  const { path, navigate } = useRoute();
  const [role, setRole] = useState(roles[0]);
  const [createdPatients, setCreatedPatients] = useState([]);
  const allPatients = useMemo(() => [...createdPatients, ...patients], [createdPatients]);
  const addPatient = (patient) => {
    setCreatedPatients((current) => [patient, ...current.filter((item) => item.id !== patient.id)]);
  };
  const handleLogout = () => navigate("/login");
  const content = useMemo(() => {
    if (path === "/login") return <Login navigate={navigate} role={role} setRole={setRole} />;
    if (path === "/dashboard") return <Dashboard navigate={navigate} role={role} patientsList={allPatients} />;
    if (path === "/patients") return <PatientsPage navigate={navigate} patientsList={allPatients} role={role} />;
    if (path === "/patients/new") return <NewPatientIntakePage navigate={navigate} onCreatePatient={addPatient} role={role} />;
    if (path === "/alerts") return <AlertsPage navigate={navigate} />;
    if (path === "/recommendations") return <RecommendationsPage navigate={navigate} />;
    if (path === "/reviews") return <ReviewsPage navigate={navigate} />;
    if (path === "/reports") return <ReportsPage />;
    if (path === "/settings") return <SettingsPage navigate={navigate} />;
    if (path === "/help") return <HelpPage navigate={navigate} />;
    const parts = path.split("/").filter(Boolean);
    if (parts[0] === "patients" && parts[1] && parts[2] === "recommendation") return <RecommendationDetail id={parts[1]} navigate={navigate} role={role} />;
    if (parts[0] === "patients" && parts[1] && parts[2] === "review") return <ReviewDetail id={parts[1]} navigate={navigate} role={role} />;
    if (parts[0] === "patients" && parts[1]) return <PatientOverview id={parts[1]} navigate={navigate} patientsList={allPatients} role={role} />;
    if (parts[0] === "recommendations" && parts[1]) return <RecommendationDetail id={parts[1]} navigate={navigate} role={role} />;
    if (parts[0] === "reviews" && parts[1]) return <ReviewDetail id={parts[1]} navigate={navigate} role={role} />;
    return <NotFound navigate={navigate} />;
  }, [path, role, allPatients]);

  if (path === "/login") return content;
  return <AppShell path={path} navigate={navigate} role={role} onLogout={handleLogout}>{content}</AppShell>;
}
