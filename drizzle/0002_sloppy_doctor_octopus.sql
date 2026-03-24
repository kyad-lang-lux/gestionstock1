CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type_action` text,
	`produit_id` integer,
	`details` text,
	`statut` text DEFAULT 'en_attente',
	`date` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mouvements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`produit_id` integer,
	`quantite` integer NOT NULL,
	`date` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`produit_id`) REFERENCES `produits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_mouvements`("id", "produit_id", "quantite", "date") SELECT "id", "produit_id", "quantite", "date" FROM `mouvements`;--> statement-breakpoint
DROP TABLE `mouvements`;--> statement-breakpoint
ALTER TABLE `__new_mouvements` RENAME TO `mouvements`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_produits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text NOT NULL,
	`categorie_id` integer,
	`prix` real NOT NULL,
	`quantite_stock` integer DEFAULT 0 NOT NULL,
	`seuil_alerte` integer DEFAULT 5 NOT NULL,
	`date_ajout` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`categorie_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_produits`("id", "nom", "categorie_id", "prix", "quantite_stock", "seuil_alerte", "date_ajout") SELECT "id", "nom", "categorie_id", "prix", "quantite_stock", "seuil_alerte", "date_ajout" FROM `produits`;--> statement-breakpoint
DROP TABLE `produits`;--> statement-breakpoint
ALTER TABLE `__new_produits` RENAME TO `produits`;