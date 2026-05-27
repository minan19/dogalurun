import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Sunucu tarafı (Server Components, Route Handlers, Server Actions)
// Service role key — sadece sunucuda kullanılır, client'a gönderilmez
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
