import "server-only";

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const supabaseServiceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
export const databaseUrl = getEnv("DATABASE_URL");
