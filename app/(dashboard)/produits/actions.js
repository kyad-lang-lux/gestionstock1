'use server';

import { db } from "@/db/index.js";
import { produits, categories } from "@/db/schema.js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Récupérer toutes les catégories pour les menus déroulants
export async function getCategoriesAction() {
  try {
    const data = await db.select().from(categories);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 2. Récupérer les produits avec une jointure pour avoir le nom de la catégorie
export async function getProduitsAction() {
  try {
    // On fait une jointure pour récupérer directement le nom de la catégorie associée
    const data = await db.select({
      id: produits.id,
      nom: produits.nom,
      prix: produits.prix,
      quantiteStock: produits.quantiteStock,
      dateAjout: produits.dateAjout,
      categorieId: produits.categorieId,
      categorieNom: categories.nom,
    })
    .from(produits)
    .leftJoin(categories, eq(produits.categorieId, categories.id));
    
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 3. Sauvegarder (Créer ou Modifier)
export async function saveProductAction(data) {
  try {
    const payload = {
      nom: data.nom,
      prix: parseFloat(data.prix),
      quantiteStock: parseInt(data.qte),
      categorieId: parseInt(data.categorieId), // On utilise l'ID envoyé par le select
    };

    if (data.id) {
      await db.update(produits).set(payload).where(eq(produits.id, data.id));
    } else {
      await db.insert(produits).values(payload);
    }

    revalidatePath('/produits');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 4. Supprimer
export async function deleteProductAction(id) {
  try {
    await db.delete(produits).where(eq(produits.id, id));
    revalidatePath('/produits');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}