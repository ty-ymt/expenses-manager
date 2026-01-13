import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env.public";
import { supabaseServiceRoleKey } from "./env.server";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
