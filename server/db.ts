import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL not set. Session store and Drizzle will use fallback connection.");
}

// Robust SSL configuration for managed Postgres (Supabase, Heroku, etc.)
const sslConfig =
  !databaseUrl || databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? false
    : {
      rejectUnauthorized: false,
    };

export const pool = new Pool({
  connectionString: databaseUrl || "postgres://user:password@localhost:5432/db",
  ssl: sslConfig,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000, // Increased to 30s
});

export const db = drizzle(pool, { schema });

// Connection check
pool.query('SELECT 1').then(() => {
  console.log("Database connection successful");
}).catch(err => {
  console.error("Database connection failed:", err.message);
});
