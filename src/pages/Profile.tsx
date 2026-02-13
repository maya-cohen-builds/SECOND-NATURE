import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { dispatchProfileUpdate } from "@/hooks/useDisplayName";
import { Camera } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        setLoading(false);
      });
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 2MB allowed.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      toast({ title: "Error", description: updateError.message, variant: "destructive" });
    } else {
      setAvatarUrl(publicUrl);
      toast({ title: "Avatar updated" });
      dispatchProfileUpdate();
    }
    setUploading(false);
  };

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
      dispatchProfileUpdate();
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

      <section className="rounded-lg border border-border bg-card p-5 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative group w-16 h-16 rounded-full bg-secondary border-2 border-border overflow-hidden flex items-center justify-center hover:border-primary/50 transition-all disabled:opacity-50"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-display font-bold text-muted-foreground">
                {(displayName || user?.email || "?")[0].toUpperCase()}
              </span>
            )}
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-5 w-5 text-foreground" />
            </div>
          </button>
          <div>
            <p className="text-sm font-medium text-foreground">
              {uploading ? "Uploading…" : "Profile photo"}
            </p>
            <p className="text-xs text-muted-foreground">Click to upload · Max 2MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>

        {/* Email */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-0.5">Email</p>
          <p className="text-sm text-foreground font-mono">{user?.email}</p>
        </div>

        {/* Display name form */}
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
