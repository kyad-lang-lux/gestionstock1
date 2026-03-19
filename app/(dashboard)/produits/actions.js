'use server';

import { db } from "@/db/index.js";
import { produits } from "@/db/schema.js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Récupérer tous les produits
export async function getProduitsAction() {
  try {
    const data = await db.select().from(produits);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Sauvegarder (Créer ou Modifier)
export async function saveProductAction(data) {
  try {
    const payload = {
      nom: data.nom,
      prix: parseFloat(data.prix),
      quantiteStock: parseInt(data.qte),
      // On simule une catégorie ID fixe pour l'instant (ex: 1) ou on gère par nom
      categorieId: data.cat === 'Ordinateurs' ? 1 : (data.cat === 'Accessoires' ? 2 : 3),
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
    console.error(e);
    return { success: false, error: e.message };
  }
}

// Supprimer
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