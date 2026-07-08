import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient as createVanillaClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Client-side Supabase connection helper
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
      from: (table: string) => ({
        select: () => ({
          order: () => ({ limit: () => ({ maybeSingle: async () => ({ data: null }), then: (cb: any) => cb({ data: [] }) }), maybeSingle: async () => ({ data: null }), then: (cb: any) => cb({ data: [] }) }),
          limit: () => ({ then: (cb: any) => cb({ data: [] }) }),
          maybeSingle: async () => ({ data: null }),
          eq: () => ({ single: async () => ({ data: null }), maybeSingle: async () => ({ data: null }), then: (cb: any) => cb({ data: [] }) }),
          then: (cb: any) => cb({ data: [] })
        }),
        insert: async () => ({ error: null }),
        update: () => ({ eq: async () => ({ error: null }) }),
        delete: () => ({ eq: async () => ({ error: null }) }),
        upsert: async () => ({ error: null })
      })
    } as any;
  }
  return createBrowserClient(url, anonKey);
}

// Server-side / Server Action / Server Component connection helper
export async function createClientServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!url || !anonKey || !url.startsWith("http")) {
    console.warn('Supabase env vars missing. Returning mock server client.');
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null })
      },
      from: (table: string) => ({
        select: () => ({
          order: () => ({ limit: () => ({ maybeSingle: async () => ({ data: null }), then: (cb: any) => cb({ data: [] }) }), maybeSingle: async () => ({ data: null }), then: (cb: any) => cb({ data: [] }) }),
          limit: () => ({ then: (cb: any) => cb({ data: [] }) }),
          maybeSingle: async () => ({ data: null }),
          eq: () => ({ single: async () => ({ data: null }), maybeSingle: async () => ({ data: null }), then: (cb: any) => cb({ data: [] }) }),
          then: (cb: any) => cb({ data: [] })
        }),
        insert: async () => ({ error: null }),
        update: () => ({ eq: async () => ({ error: null }) }),
        delete: () => ({ eq: async () => ({ error: null }) }),
        upsert: async () => ({ error: null })
      })
    } as any;
  }
  
  const cookieStore = await cookies();
  
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method can be called from a Server Component
          // which cannot write cookies. This can be safely ignored.
        }
      },
    },
  });
}

// Stateless public client for ISR / SSG (No cookies)
export function createClientPublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!url || !anonKey || !url.startsWith("http")) {
    return createClient(); // Fallback to synchronous mock in error state
  }
  
  return createVanillaClient(url, anonKey);
}
