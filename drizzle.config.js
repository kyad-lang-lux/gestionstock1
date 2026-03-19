import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Charge les variables d'environnement depuis .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.js", // Vérifie que ton dossier db est bien à la racine
  out: "./drizzle",
  dialect: "sqlite", // Turso utilise le dialecte sqlite
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});