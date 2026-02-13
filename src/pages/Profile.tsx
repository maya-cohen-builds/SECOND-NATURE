import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
        setLoading(false);
      });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() || null })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Display name updated." });
    }
    setSaving(false);
  };

  if (loading) {
    return <p className="text-muted-foreground animate-pulse">Loading profile…</p>;
  }

  return (
    <div className="max-w-md space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground tracking-wide">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details.</p>
      </div>

      <section className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-0.5">Email</p>
          <p className="text-sm text-foreground font-mono">{user?.email}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label htmlFor="displayName" className="block text-xs font-medium text-muted-foreground mb-1.5">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              maxLength={50}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="How should we call you?"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary text-primary-foreground px-5 py-2 text-sm font-display font-semibold tracking-wide hover:brightness-110 transition-all disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </section>
    </div>
  );
}
