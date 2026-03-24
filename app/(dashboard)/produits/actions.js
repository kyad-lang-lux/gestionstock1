'use server';

import { db } from "@/db/index.js";
import { produits, categories, notifications, mouvements } from "@/db/schema.js";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Récupérer les catégories
export async function getCategoriesAction() {
  try {
    const data = await db.select().from(categories);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 2. Récupérer les produits
export async function getProduitsAction() {
  try {
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

// 3. Demander Sauvegarde (Modifie ou Ajoute via Notification)
export async function saveProductAction(data) {
  try {
    const payload = {
      id: data.id || null, // Garde l'ID s'il existe pour l'UPDATE
      nom: data.nom,
      prix: parseFloat(data.prix),
      qte: parseInt(data.qte),
      categorieId: parseInt(data.categorieId),
    };

    await db.insert(notifications).values({
      typeAction: data.id ? 'UPDATE' : 'ADD',
      produitId: data.id ? parseInt(data.id) : null,
      details: JSON.stringify(payload),
      statut: 'en_attente',
    });

    revalidatePath('/admin/notifications');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 4. Demander Suppression
export async function deleteProductAction(id) {
  try {
    const [prod] = await db.select().from(produits).where(eq(produits.id, id));
    await db.insert(notifications).values({
      typeAction: 'DELETE',
      produitId: id,
      details: JSON.stringify({ nom: prod?.nom || "Produit", id: id }),
      statut: 'en_attente',
    });
    revalidatePath('/admin/notifications');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// --- ACTIONS RÉELLES DE L'ADMIN ---

export async function validateAction(notifId) {
  try {
    const [notif] = await db.select().from(notifications).where(eq(notifications.id, notifId));
    if (!notif) return { success: false };

    const data = JSON.parse(notif.details);

    if (notif.typeAction === 'ADD') {
      const newProd = await db.insert(produits).values({
        nom: data.nom,
        prix: data.prix,
        quantiteStock: data.qte,
        categorieId: data.categorieId
      }).returning();
      
      await db.insert(mouvements).values({
        produitId: newProd[0].id,
        quantite: data.qte
      });

    } else if (notif.typeAction === 'UPDATE') {
      // MISE À JOUR RÉELLE DU PRODUIT
      await db.update(produits)
        .set({
          nom: data.nom,
          prix: data.prix,
          quantiteStock: data.qte,
          categorieId: data.categorieId
        })
        .where(eq(produits.id, data.id)); // Utilise l'ID envoyé dans le JSON

    } else if (notif.typeAction === 'DELETE') {
      await db.delete(produits).where(eq(produits.id, data.id));
    }

    // Marquer comme validé pour faire disparaître de la liste
    await db.update(notifications).set({ statut: 'valide' }).where(eq(notifications.id, notifId));
    
    revalidatePath('/produits');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function rejectAction(notifId) {
  await db.update(notifications).set({ statut: 'annule' }).where(eq(notifications.id, notifId));
  revalidatePath('/admin/notifications');
  return { success: true };
}

export async function getPendingNotificationsAction() {
  try {
    const data = await db.select()
      .from(notifications)
      .where(eq(notifications.statut, "en_attente"));
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}