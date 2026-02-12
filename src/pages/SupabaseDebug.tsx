export default function SupabaseDebug() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const present = Boolean(url) && Boolean(key);

  return (
    <div className="p-8">
      <h2 className="font-display text-lg font-bold text-foreground mb-2">Supabase Environment Check</h2>
      <p className="text-sm text-muted-foreground">
        Supabase env vars present:{" "}
        <span className={present ? "text-green-500 font-semibold" : "text-destructive font-semibold"}>
          {String(present)}
        </span>
      </p>
    </div>
  );
}
