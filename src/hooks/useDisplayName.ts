import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useDisplayName(fallback = 'Player') {
  const [displayName, setDisplayName] = useState(fallback);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
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

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }
    fetch();
  }, [fallback]);

  return { displayName, avatarUrl };
}
