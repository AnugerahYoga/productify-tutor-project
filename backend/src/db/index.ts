import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

if (!ENV.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in enviroment variable");
}

// meng inisiasi PostgreSQL connection
const pool = new Pool({ connectionString: ENV.DATABASE_URL });

// log ketika permakali melakukan connectin
pool.on("connect", () => {
  console.log("Database connected successfully");
});

// log ketika ada error
pool.on("error", (err) => {
  console.log("Database connection error", err);
});

export const db = drizzle({ client: pool, schema });
