import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema.js";
import * as dotenv from "dotenv"; // Ajoute ceci

// Charge le fichier .env.local manuellement
dotenv.config({ path: ".env.local" }); 

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });