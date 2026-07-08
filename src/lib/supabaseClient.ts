import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!url || !anonKey || !url.startsWith("http")) {
    console.warn('Supabase env vars missing. Returning mock browser client.');
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      storage: {
        from: () => ({
          upload: async () => ({ error: new Error('Mock client cannot upload') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      }
    } as any;
  }
  
  return createBrowserClient(url, anonKey);
}
