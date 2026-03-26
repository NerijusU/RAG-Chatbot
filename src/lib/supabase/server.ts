import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getRequiredEnv } from "@/lib/env";

/**
 * Creates a server-side Supabase client using project secrets.
 *
 * @param none - This function does not accept any parameters.
 * @returns Supabase client configured with server-only credentials.
 */
export function createServerSupabaseClient(): SupabaseClient {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
