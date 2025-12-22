const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
export const supabaseAnonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
export const databaseUrl = getEnv("DATABASE_URL");
