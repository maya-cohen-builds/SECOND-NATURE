import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type AuthView = "sign-in" | "sign-up" | "forgot" | "update-password";

export default function Auth() {
  const { session, signIn, signUp } = useAuth();
  const [view, setView] = useState<AuthView>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Detect recovery flow from email link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setView("update-password");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session && view !== "update-password") return <Navigate to="/overview" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    if (view === "sign-up") {
      const { error } = await signUp(email, password);
      if (error) setError(error);
      else setInfo("Check your email for a confirmation link before signing in.");
    } else if (view === "sign-in") {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else if (view === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) setError(error.message);
      else setInfo("Password reset link sent — check your inbox.");
    } else if (view === "update-password") {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) setError(error.message);
      else {
        setInfo("Password updated successfully! Redirecting…");
        setTimeout(() => window.location.replace("/overview"), 1500);
      }
    }

    setSubmitting(false);
  };

  const switchView = (v: AuthView) => { setView(v); setError(null); setInfo(null); };

  const showPasswordField = view === "sign-in" || view === "sign-up" || view === "update-password";
  const showEmailField = view !== "update-password";

  const headingText = {
    "sign-in": "Sign In",
    "sign-up": "Create Account",
    "forgot": "Reset Password",
    "update-password": "Set New Password",
  }[view];

  const buttonText = {
    "sign-in": "Sign In",
    "sign-up": "Create Account",
    "forgot": "Send Reset Link",
    "update-password": "Update Password",
  }[view];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
            <span className="text-primary font-display font-bold text-xl">SN</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-wider text-foreground">
            {headingText}
          </h1>
          <p className="text-sm text-muted-foreground">
            {view === "forgot" ? "Enter your email to receive a reset link" :
             view === "update-password" ? "Choose a new password (min 6 characters)" :
             "Cross-Game Coordination System"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {showEmailField && (
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
              />
            </div>
          )}

          {showPasswordField && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-muted-foreground">
                  Password
                </label>
                {view === "sign-in" && (
                  <button
                    type="button"
                    onClick={() => switchView("forgot")}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2 border border-destructive/20">
              {error}
            </p>
          )}
          {info && (
            <p className="text-xs text-primary bg-primary/10 rounded-md px-3 py-2 border border-primary/20">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-display font-semibold tracking-wide hover:brightness-110 transition-all disabled:opacity-50"
          >
            {submitting ? "Please wait…" : buttonText}
          </button>
        </form>

        {/* Google + toggle only on sign-in / sign-up */}
        {(view === "sign-in" || view === "sign-up") && (
          <>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              type="button"
              disabled={googleLoading}
              onClick={async () => {
                setGoogleLoading(true);
                setError(null);
                const { error } = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (error) setError(error.message ?? "Google sign-in failed");
                setGoogleLoading(false);
              }}
              className="w-full flex items-center justify-center gap-2.5 rounded-md border border-border bg-card py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-all disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? "Redirecting…" : "Continue with Google"}
            </button>
          </>
        )}

        {/* Footer links */}
        <p className="text-center text-xs text-muted-foreground">
          {view === "sign-up" && (<>Already have an account?{" "}
            <button type="button" onClick={() => switchView("sign-in")} className="text-primary hover:underline font-medium">Sign in</button>
          </>)}
          {view === "sign-in" && (<>Don't have an account?{" "}
            <button type="button" onClick={() => switchView("sign-up")} className="text-primary hover:underline font-medium">Sign up</button>
          </>)}
          {view === "forgot" && (<>Remember your password?{" "}
            <button type="button" onClick={() => switchView("sign-in")} className="text-primary hover:underline font-medium">Back to sign in</button>
          </>)}
          {view === "update-password" && (<>
            <button type="button" onClick={() => switchView("sign-in")} className="text-primary hover:underline font-medium">Back to sign in</button>
          </>)}
        </p>
      </div>
    </div>
  );
}