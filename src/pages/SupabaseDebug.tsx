import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

function Check({ label, value }: { label: string; value: boolean | null }) {
  return (
    <p className="text-sm font-mono">
      {label}:{" "}
      <span className={value === null ? "text-muted-foreground" : value ? "text-green-500 font-bold" : "text-destructive font-bold"}>
        {value === null ? "checking…" : String(value)}
      </span>
    </p>
  );
}

export default function SupabaseDebug() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const pubKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const [clientOk, setClientOk] = useState<boolean | null>(null);
  const [sessionOk, setSessionOk] = useState<boolean | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [profilesOk, setProfilesOk] = useState<boolean | null>(null);
  const [profilesMsg, setProfilesMsg] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupResult, setSignupResult] = useState<string | null>(null);
  const [signingUp, setSigningUp] = useState(false);

  useEffect(() => {
    // Client import check
    setClientOk(!!supabase);

    // Auth session check
    supabase.auth.getSession().then(({ data, error }) => {
      setSessionOk(!error);
      setHasSession(!!data?.session);
      if (error) setSessionError(error.message);
    });

    // Profiles table check
    supabase.from("profiles").select("id").limit(1).then(({ error }) => {
      if (!error) {
        setProfilesOk(true);
      } else if (error.message?.toLowerCase().includes("does not exist") || error.code === "42P01") {
        setProfilesOk(true);
        setProfilesMsg("profiles table not created yet");
      } else {
        setProfilesOk(false);
        setProfilesMsg(error.message);
      }
    });
  }, []);

  const handleSignup = async () => {
    setSigningUp(true);
    setSignupResult(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setSignupResult(error ? `Error: ${error.message}` : "Sign-up successful — check email for confirmation.");
    setSigningUp(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-xl">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground mb-1">⚠️ TEMP DEBUG — Supabase Wiring</h2>
        <p className="text-xs text-muted-foreground">Remove this page before shipping.</p>
      </div>

      <section className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground mb-1">Env var presence</h3>
        <Check label="VITE_SUPABASE_URL present" value={Boolean(url)} />
        <Check label="VITE_SUPABASE_ANON_KEY present" value={Boolean(anonKey)} />
        <Check label="VITE_SUPABASE_PUBLISHABLE_KEY present" value={Boolean(pubKey)} />
      </section>

      <section className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground mb-1">Client import</h3>
        <Check label="Client import ok" value={clientOk} />
      </section>

      <section className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground mb-1">Connectivity — auth.getSession()</h3>
        <Check label="Auth getSession ok" value={sessionOk} />
        <Check label="Has active session" value={hasSession} />
        {sessionError && <p className="text-xs text-destructive font-mono">Error: {sessionError}</p>}
      </section>

      <section className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground mb-1">Database — profiles table</h3>
        <Check label="Profiles table query ok" value={profilesOk} />
        {profilesMsg && <p className="text-xs text-muted-foreground font-mono">{profilesMsg}</p>}
      </section>

      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-foreground">Create test user (wiring verification only)</h3>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={handleSignup}
          disabled={signingUp || !email || !password}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {signingUp ? "Signing up…" : "Sign up"}
        </button>
        {signupResult && <p className="text-xs font-mono text-muted-foreground">{signupResult}</p>}
      </section>
    </div>
  );
}
