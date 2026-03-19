'use server';

import { db } from "@/db/index.js";
import { categories, produits } from "@/db/schema.js";
import { sql, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Récupérer les catégories avec le compte de produits réel
export async function getCategoriesAction() {
  try {
    const data = await db.select({
      id: categories.id,
      nom: categories.nom,
      count: sql`count(${produits.id})`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(produits, eq(produits.categorieId, categories.id))
    .groupBy(categories.id);
    
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Ajouter une catégorie
export async function addCategoryAction(nom) {
  try {
    await db.insert(categories).values({ nom });
    revalidatePath('/categories');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Supprimer une catégorie
export async function deleteCategoryAction(id) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath('/categories');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}