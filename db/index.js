import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

let db;

// On n'initialise LibSQL QUE si on a une URL (donc sur le serveur)
if (url) {
  const client = createClient({
    url: url,
    authToken: authToken,
  });
  db = drizzle(client, { schema });
} else {
  // Côté client, on exporte un objet vide ou un proxy pour éviter les erreurs d'import
  db = new Proxy({}, {
    get() {
      throw new Error("La base de données ne peut pas être accédée depuis le navigateur (Client-side). Utilisez une Server Action.");
    }
  });
}

export { db };