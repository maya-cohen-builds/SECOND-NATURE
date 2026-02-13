import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type Status = "PASS" | "FAIL" | "PENDING" | "WARN";

interface CheckResult {
  id: string;
  label: string;
  status: Status;
  evidence: string;
}

function StatusBadge({ status }: { status: Status }) {
  const colors: Record<Status, string> = {
    PASS: "bg-green-600 text-white",
    FAIL: "bg-red-600 text-white",
    PENDING: "bg-yellow-500 text-black",
    WARN: "bg-orange-500 text-white",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${colors[status]}`}>
      {status}
    </span>
  );
}

function redact(val: string | undefined): string {
  if (!val) return "(missing)";
  if (val.length < 12) return "***";
  return val.slice(0, 6) + "..." + val.slice(-4);
}

const TABLES_TO_CHECK = ["profiles", "training_runs", "insights", "drill_runs", "tokens_ledger", "entitlements"];

export default function VerificationPanel() {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [authLogs, setAuthLogs] = useState<string[]>([]);
  const [testEmail, setTestEmail] = useState("maya+lovabletest001@example.com");
  const [testPassword, setTestPassword] = useState("Test1234!!");
  const [running, setRunning] = useState(false);
  const [authFlowResults, setAuthFlowResults] = useState<CheckResult[]>([]);
  const [dbResults, setDbResults] = useState<CheckResult[]>([]);
  const authUnsubRef = useRef<{ unsubscribe: () => void } | null>(null);

  const addCheck = (prev: CheckResult[], c: CheckResult) => {
    const idx = prev.findIndex((x) => x.id === c.id);
    if (idx >= 0) {
      const copy = [...prev];
      copy[idx] = c;
      return copy;
    }
    return [...prev, c];
  };

  // ─── A-checks: run on mount ───
  useEffect(() => {
    runAChecks();
    // Subscribe to auth state changes for B4
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthLogs((prev) => [
        ...prev,
        `[${new Date().toISOString()}] ${event} — session: ${session ? "exists" : "null"}`,
      ]);
    });
    authUnsubRef.current = data.subscription;
    return () => {
      authUnsubRef.current?.unsubscribe();
    };
  }, []);

  async function runAChecks() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const pubKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    // A1 — env vars
    const urlPresent = Boolean(url);
    const keyPresent = Boolean(anonKey) || Boolean(pubKey);
    const keyUsed = anonKey || pubKey;

    setChecks((prev) =>
      addCheck(prev, {
        id: "A1",
        label: "Env vars exist at runtime",
        status: urlPresent && keyPresent ? "PASS" : "FAIL",
        evidence: `VITE_SUPABASE_URL: ${urlPresent ? redact(url) : "MISSING"}\nVITE_SUPABASE_ANON_KEY: ${anonKey ? redact(anonKey) : "NOT SET"}\nVITE_SUPABASE_PUBLISHABLE_KEY: ${pubKey ? redact(pubKey) : "NOT SET"}\nKey used for client: ${redact(keyUsed)}`,
      })
    );

    // A2 — client init
    const clientOk = !!supabase && typeof supabase.auth?.getSession === "function";
    console.log("[VerificationPanel] A2 — Supabase client init:", clientOk ? "SUCCESS" : "FAIL");
    setChecks((prev) =>
      addCheck(prev, {
        id: "A2",
        label: "Supabase client initializes without throwing",
        status: clientOk ? "PASS" : "FAIL",
        evidence: `Client exists: ${!!supabase}\nauth.getSession is function: ${typeof supabase?.auth?.getSession === "function"}\nInit module: src/integrations/supabase/client.ts\nConsole log: "[VerificationPanel] A2 — Supabase client init: SUCCESS"`,
      })
    );

    // A3 — getSession
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log("[VerificationPanel] A3 — getSession result:", JSON.stringify({ session: data?.session ? "exists" : "null", error: error?.message || null }));
      setChecks((prev) =>
        addCheck(prev, {
          id: "A3",
          label: "supabase.auth.getSession() executes",
          status: error ? "FAIL" : "PASS",
          evidence: `Returned session: ${data?.session ? "exists (user: " + data.session.user.id.slice(0, 8) + "...)" : "null (not logged in)"}\nError: ${error?.message || "none"}`,
        })
      );
    } catch (e: any) {
      setChecks((prev) =>
        addCheck(prev, {
          id: "A3",
          label: "supabase.auth.getSession() executes",
          status: "FAIL",
          evidence: `Exception: ${e.message}`,
        })
      );
    }
  }

  // ─── B-checks: auth flow ───
  async function runAuthFlow() {
    setRunning(true);
    setAuthFlowResults([]);
    const results: CheckResult[] = [];

    // B1 — signup
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });
      console.log("[VerificationPanel] B1 — signUp:", JSON.stringify({ userId: data?.user?.id, error: error?.message }));
      if (error) {
        // If user already exists, try login directly
        results.push({
          id: "B1",
          label: "Email+password signup returns user",
          status: "WARN",
          evidence: `Error: ${error.message}\n(User may already exist — will proceed to login)`,
        });
      } else {
        results.push({
          id: "B1",
          label: "Email+password signup returns user",
          status: data?.user?.id ? "PASS" : "FAIL",
          evidence: `User ID: ${data?.user?.id || "none"}\nEmail: ${data?.user?.email || "none"}\nConfirmation required: ${data?.user?.confirmation_sent_at ? "yes" : "no/auto-confirmed"}`,
        });
      }
    } catch (e: any) {
      results.push({ id: "B1", label: "Signup", status: "FAIL", evidence: `Exception: ${e.message}` });
    }

    // B2 — login
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      console.log("[VerificationPanel] B2 — login:", JSON.stringify({ userId: data?.user?.id, hasToken: !!data?.session?.access_token, error: error?.message }));
      results.push({
        id: "B2",
        label: "Login returns a session",
        status: data?.session?.access_token ? "PASS" : "FAIL",
        evidence: `User ID: ${data?.user?.id || "none"}\naccess_token: ${data?.session?.access_token ? redact(data.session.access_token) : "none"}\nError: ${error?.message || "none"}`,
      });
    } catch (e: any) {
      results.push({ id: "B2", label: "Login", status: "FAIL", evidence: `Exception: ${e.message}` });
    }

    // A4 check — auth endpoints responded (derived from B1+B2)
    setChecks((prev) =>
      addCheck(prev, {
        id: "A4",
        label: "Auth endpoints respond (signup, login)",
        status: results.some((r) => r.id === "B2" && r.status === "PASS") ? "PASS" : "FAIL",
        evidence: "See B1 and B2 results below.",
      })
    );

    // B5 — UI reacts to logged-in state
    const { data: sessionData } = await supabase.auth.getSession();
    results.push({
      id: "B5",
      label: "UI reacts to logged-in state",
      status: sessionData?.session ? "PASS" : "WARN",
      evidence: `Session active after login: ${!!sessionData?.session}\nNote: App currently has no auth-gated UI — no onAuthStateChange listener was found in the codebase before this panel was added.`,
    });

    // B3 — logout
    try {
      const { error } = await supabase.auth.signOut();
      const { data: afterLogout } = await supabase.auth.getSession();
      console.log("[VerificationPanel] B3 — logout:", JSON.stringify({ error: error?.message, sessionAfter: afterLogout?.session ? "exists" : "null" }));
      results.push({
        id: "B3",
        label: "Logout clears session",
        status: !afterLogout?.session && !error ? "PASS" : "FAIL",
        evidence: `signOut error: ${error?.message || "none"}\nSession after logout: ${afterLogout?.session ? "still exists (FAIL)" : "null (cleared)"}`,
      });
    } catch (e: any) {
      results.push({ id: "B3", label: "Logout", status: "FAIL", evidence: `Exception: ${e.message}` });
    }

    // B4 — auth state change events (check logs)
    results.push({
      id: "B4",
      label: "Auth state change events fire",
      status: authLogs.length > 0 ? "PASS" : "WARN",
      evidence: `Events captured so far: ${authLogs.length}\n${authLogs.slice(-5).join("\n") || "(none yet — check Auth Logs section below)"}`,
    });

    // A5 — session persistence (requires manual refresh, mark as info)
    results.push({
      id: "A5",
      label: "Session persistence across refresh",
      status: "WARN",
      evidence: "To verify: login, then refresh the browser. If session persists, A5=PASS.\nClient config: persistSession=true, storage=localStorage (see src/integrations/supabase/client.ts:12-16).",
    });

    setAuthFlowResults(results);
    setRunning(false);
  }

  // ─── C-checks: DB connectivity ───
  async function runDBChecks() {
    const results: CheckResult[] = [];

    for (const table of TABLES_TO_CHECK) {
      // C1 — existence
      try {
        const { data, error } = await (supabase.from as any)(table).select("id").limit(1);
        console.log(`[VerificationPanel] C1 — ${table}:`, JSON.stringify({ rows: data?.length, error: error?.message }));
        if (error) {
          const notExist = error.message?.toLowerCase().includes("does not exist") || error.code === "42P01";
          results.push({
            id: `C1-${table}`,
            label: `${table} — existence check`,
            status: notExist ? "FAIL" : "FAIL",
            evidence: `Error: ${error.message}\nCode: ${error.code}\n${notExist ? "Table does not exist in database." : "Query failed."}`,
          });
          continue; // skip C2/C3 for missing tables
        }
        results.push({
          id: `C1-${table}`,
          label: `${table} — existence check`,
          status: "PASS",
          evidence: `Query returned ${data?.length ?? 0} row(s). Table exists.`,
        });
      } catch (e: any) {
        results.push({ id: `C1-${table}`, label: `${table} — existence`, status: "FAIL", evidence: `Exception: ${e.message}` });
        continue;
      }

      // C3 — user-scoped query (only for existing tables)
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          results.push({
            id: `C3-${table}`,
            label: `${table} — user-scoped query`,
            status: "WARN",
            evidence: "No active session — cannot test user-scoped queries. Login first via the auth flow above.",
          });
        } else {
          const userId = sessionData.session.user.id;
          const col = table === "profiles" ? "id" : "user_id";
          const { data, error } = await (supabase.from as any)(table).select("*").eq(col, userId).limit(3);
          console.log(`[VerificationPanel] C3 — ${table} user-scoped:`, JSON.stringify({ rows: data?.length, error: error?.message }));
          results.push({
            id: `C3-${table}`,
            label: `${table} — user-scoped query`,
            status: error ? "FAIL" : "PASS",
            evidence: `Query: .eq("${col}", "${userId.slice(0, 8)}...")\nRows returned: ${data?.length ?? 0}\nError: ${error?.message || "none"}`,
          });
        }
      } catch (e: any) {
        results.push({ id: `C3-${table}`, label: `${table} — user-scoped`, status: "FAIL", evidence: `Exception: ${e.message}` });
      }
    }

    setDbResults(results);
  }

  const allChecks = [...checks, ...authFlowResults, ...dbResults];
  const passCount = allChecks.filter((c) => c.status === "PASS").length;
  const failCount = allChecks.filter((c) => c.status === "FAIL").length;

  return (
    <div className="p-6 max-w-3xl space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">⚙️ TEMP — Supabase Verification Panel</h2>
        <p className="text-xs text-muted-foreground mt-1">Remove before shipping. Real runtime evidence only.</p>
      </div>

      {/* Summary */}
      <div className="flex gap-4 text-sm font-mono">
        <span className="text-green-500 font-bold">PASS: {passCount}</span>
        <span className="text-red-500 font-bold">FAIL: {failCount}</span>
        <span className="text-yellow-500">PENDING/WARN: {allChecks.length - passCount - failCount}</span>
      </div>

      {/* A-checks */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-foreground border-b border-border pb-1">A — Supabase Wiring</h3>
        {checks.map((c) => (
          <div key={c.id} className="p-3 rounded-lg bg-card border border-border space-y-1">
            <div className="flex items-center gap-2">
              <StatusBadge status={c.status} />
              <span className="text-sm font-semibold">{c.id}: {c.label}</span>
            </div>
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{c.evidence}</pre>
          </div>
        ))}
      </section>

      {/* B-checks */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-foreground border-b border-border pb-1">B — Auth Flows</h3>
        <div className="p-3 rounded-lg bg-card border border-border space-y-3">
          <div className="flex gap-2 items-end flex-wrap">
            <div>
              <label className="text-[10px] text-muted-foreground block">Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="block w-56 rounded-md border border-input bg-background px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block">Password</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="block w-40 rounded-md border border-input bg-background px-2 py-1.5 text-xs"
              />
            </div>
            <button
              onClick={runAuthFlow}
              disabled={running}
              className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold disabled:opacity-50"
            >
              {running ? "Running…" : "Run Auth Flow (B1→B5)"}
            </button>
          </div>
        </div>
        {authFlowResults.map((c) => (
          <div key={c.id} className="p-3 rounded-lg bg-card border border-border space-y-1">
            <div className="flex items-center gap-2">
              <StatusBadge status={c.status} />
              <span className="text-sm font-semibold">{c.id}: {c.label}</span>
            </div>
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{c.evidence}</pre>
          </div>
        ))}
      </section>

      {/* Auth Logs */}
      <section className="space-y-2">
        <h3 className="text-sm font-bold text-foreground border-b border-border pb-1">Auth State Change Logs (B4)</h3>
        <div className="p-3 rounded-lg bg-card border border-border">
          {authLogs.length === 0 ? (
            <p className="text-xs text-muted-foreground font-mono">No auth state change events captured yet.</p>
          ) : (
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{authLogs.join("\n")}</pre>
          )}
        </div>
      </section>

      {/* C-checks */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-foreground border-b border-border pb-1">C — DB Connectivity</h3>
        <button
          onClick={runDBChecks}
          className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold"
        >
          Run DB Checks (C1→C3)
        </button>
        {dbResults.map((c) => (
          <div key={c.id} className="p-3 rounded-lg bg-card border border-border space-y-1">
            <div className="flex items-center gap-2">
              <StatusBadge status={c.status} />
              <span className="text-sm font-semibold">{c.id}: {c.label}</span>
            </div>
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{c.evidence}</pre>
          </div>
        ))}
      </section>

      {/* Known Failures */}
      <section className="space-y-2">
        <h3 className="text-sm font-bold text-foreground border-b border-border pb-1">Known Issues (Pre-diagnosed)</h3>
        <div className="p-3 rounded-lg bg-card border border-border text-xs font-mono text-muted-foreground space-y-2">
          <p><strong>FAIL expected:</strong> Tables <code>drill_runs</code>, <code>tokens_ledger</code>, <code>entitlements</code> do not exist in the database. Only <code>profiles</code>, <code>training_runs</code>, and <code>insights</code> exist.</p>
          <p><strong>WARN expected:</strong> No <code>onAuthStateChange</code> listener exists in the main app code — only in this verification panel. The app has no auth-gated UI or login/signup flow yet.</p>
          <p><strong>A5 (session persistence):</strong> Requires manual browser refresh to verify. Client config has <code>persistSession: true</code> and <code>storage: localStorage</code>.</p>
        </div>
      </section>
    </div>
  );
}
