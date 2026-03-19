import { db } from "./index.js";
import { users, categories, produits, mouvements } from "./schema.js";

async function seed() {
  console.log("🌱 Début du remplissage de la base de données...");

  // 1. Nettoyage (Optionnel - à utiliser avec prudence)
  // await db.delete(mouvements);
  // await db.delete(produits);
  // await db.delete(categories);
  // await db.delete(users);

  // 2. Création de l'utilisateur
  const user = await db.insert(users).values({
    username: "stoicisme69",
    password: "ton_password_hash_ici", // Utilise un hash en prod
  }).returning();

  // 3. Création des catégories
  const cats = await db.insert(categories).values([
    { nom: "Ordinateurs" },
    { nom: "Accessoires" },
    { nom: "Moniteurs" },
    { nom: "Audio" },
    { nom: "Stockage" },
    { nom: "Réseau" },
  ]).returning();

  // 4. Ajout des produits de tes captures d'écran
  const prods = await db.insert(produits).values([
    { 
      nom: 'MacBook Pro 14"', 
      categorieId: cats[0].id, 
      prix: 2499, 
      quantiteStock: 15, 
      seuilAlerte: 5 
    },
    { 
      nom: 'Dell XPS 15', 
      categorieId: cats[0].id, 
      prix: 1899, 
      quantiteStock: 8, 
      seuilAlerte: 5 
    },
    { 
      nom: 'Clavier Logitech MX Keys', 
      categorieId: cats[1].id, 
      prix: 119, 
      quantiteStock: 3, 
      seuilAlerte: 5 
    },
    { 
      nom: 'Écran Samsung 27"', 
      categorieId: cats[2].id, 
      prix: 399, 
      quantiteStock: 0, 
      seuilAlerte: 5 
    },
  ]).returning();

  console.log("✅ Base de données initialisée avec succès !");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur lors du seeding :", err);
  process.exit(1);
});