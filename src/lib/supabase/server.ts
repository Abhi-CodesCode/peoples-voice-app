import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Automatically wires cookie read/write via next/headers.
 */
export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // setAll may throw when called from a Server Component
            // (read-only cookies). This is safe to ignore — the
            // middleware will refresh the session ahead of time.
          }
        },
      },
    }
  );
}

/**
 * Create a privileged Supabase client that bypasses RLS.
 * ⚠️  Use ONLY in trusted server-side contexts (admin routes, cron jobs).
 */
export function createServiceRoleClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // Service-role client does not need cookies
        },
      },
    }
  );
}
