import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useDisplayName(fallback = 'Player') {
  const [displayName, setDisplayName] = useState(fallback);

  useEffect(() => {
    async function fetch() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      if (data?.display_name) {
        setDisplayName(data.display_name);
      } else if (user.email) {
        setDisplayName(user.email.split('@')[0]);
      }
    }
    fetch();
  }, [fallback]);

  return displayName;
}
