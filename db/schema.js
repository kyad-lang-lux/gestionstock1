import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// 1. Table Utilisateur (Unique pour tes paramètres)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  password: text("password").notNull(), // Stockera le hash
});

// 2. Table Catégories
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
});

// 3. Table Produits
export const produits = sqliteTable("produits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nom: text("nom").notNull(),
  categorieId: integer("categorie_id").references(() => categories.id),
  prix: real("prix").notNull(),
  quantiteStock: integer("quantite_stock").notNull().default(0),
  seuilAlerte: integer("seuil_alerte").notNull().default(5),
  dateAjout: text("date_ajout").default(new Date().toISOString()),
});

// 4. Table Mouvements (Pour l'historique et les graphiques du Dashboard)
export const mouvements = sqliteTable("mouvements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  produitId: integer("produit_id").references(() => produits.id, { onDelete: 'cascade' }),
  quantite: integer("quantite").notNull(), // + pour entrée, - pour sortie
  date: text("date").default(new Date().toISOString()),
});