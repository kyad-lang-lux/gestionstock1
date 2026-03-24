import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. Table Utilisateur (Employés / Staff)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  password: text("password").notNull(),
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
  dateAjout: text("date_ajout").default(sql`CURRENT_TIMESTAMP`),
});

// 4. Table Mouvements (Historique entrées/sorties)
export const mouvements = sqliteTable("mouvements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  produitId: integer("produit_id").references(() => produits.id, { onDelete: 'cascade' }),
  quantite: integer("quantite").notNull(), 
  date: text("date").default(sql`CURRENT_TIMESTAMP`),
});

// 5. Table Notifications (Validation Admin)
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  typeAction: text("type_action"), // 'UPDATE' ou 'DELETE'
  produitId: integer("produit_id"),
  details: text("details"), // JSON des modifications
  statut: text("statut").default("en_attente"), // 'en_attente', 'valide', 'annule'
  date: text("date").default(sql`CURRENT_TIMESTAMP`),
});