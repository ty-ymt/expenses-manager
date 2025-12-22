import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

export default createClient;
