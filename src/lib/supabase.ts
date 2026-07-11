import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient as createVanillaClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function createMockClient() {
  const mockQueryBuilder = {
    select: function(columns?: string, options?: { count?: string; head?: boolean }) {
      return this;
    },
    order: function() { return this; },
    limit: function() { return this; },
    eq: function() { return this; },
    single: async function() { 
      return { data: { role: 'super_admin' }, error: null, count: 1 };
    },
    maybeSingle: async function() {
      return { data: null, error: null, count: 0 };
    },
    insert: async function() { return { data: null, error: null }; },
    update: function() { return this; },
    delete: function() { return this; },
    upsert: async function() { return { data: null, error: null }; },
    then: function(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
      return Promise.resolve({ data: [], count: 0, error: null }).then(onfulfilled, onrejected);
    }
  };

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async ({ email, password }: any) => {
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email: email,
              user_metadata: { name: email.split('@')[0] }
            }
          },
          error: null
        };
      },
      signUp: async ({ email, password }: any) => {
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email: email,
              user_metadata: { name: email.split('@')[0] }
            }
          },
          error: null
        };
      },
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: (table: string) => mockQueryBuilder
  } as any;
}

// Client-side Supabase connection helper
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  
  if (!url || !anonKey || !url.startsWith("http")) {
    console.warn('Supabase env vars missing. Returning mock browser client.');
    return createMockClient();
  }
  return createBrowserClient(url, anonKey);
}

// Server-side / Server Action / Server Component connection helper
export async function createClientServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  
  if (!url || !anonKey || !url.startsWith("http")) {
    console.warn('Supabase env vars missing. Returning mock server client.');
    return createMockClient();
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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  
  if (!url || !anonKey || !url.startsWith("http")) {
    return createClient(); // Fallback to mock
  }
  
  return createVanillaClient(url, anonKey);
}
