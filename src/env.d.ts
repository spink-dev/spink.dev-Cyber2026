/// <reference types="astro/client" />

import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '@lib/supabase/database.types';

declare global {
  namespace App {
    /**
     * Populated by src/middleware.ts on every server-rendered request.
     * `supabase` is null when the Supabase env vars are not set (template builds without a project).
     * `user` is null for anonymous visitors.
     */
    interface Locals {
      supabase: SupabaseClient<Database> | null;
      user: User | null;
    }
  }
}
