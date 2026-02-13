import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PROFILE_UPDATED_EVENT = 'profile-updated';

export function dispatchProfileUpdate() {
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}

export function useDisplayName(fallback = 'Player') {
  const [displayName, setDisplayName] = useState(fallback);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    if (data?.display_name) {
      setDisplayName(data.display_name);
    } else if (user.email) {
      setDisplayName(user.email.split('@')[0]);
    }

    setAvatarUrl(data?.avatar_url ?? null);
  }, []);

  useEffect(() => {
    fetchProfile();
    window.addEventListener(PROFILE_UPDATED_EVENT, fetchProfile);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, fetchProfile);
  }, [fetchProfile]);

  return { displayName, avatarUrl };
}
