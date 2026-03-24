'use server';
import { db } from '@/db';
import { produits, mouvements, notifications } from '@/db/schema.js';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

// --- 1. FONCTION POUR L'EMPLOYÉ (Demande de modification) ---
export async function requestProductChange(formData) {
  const type = formData.get('type'); // 'ADD', 'UPDATE' ou 'DELETE'
  const produitId = formData.get('id') ? parseInt(formData.get('id')) : null;
  const nom = formData.get('nom');
  
  // On prépare les données sous forme de texte (JSON) pour l'admin
  const detailsObj = {
    nom: nom,
    cat_id: parseInt(formData.get('cat_id')),
    prix: parseFloat(formData.get('prix')),
    qte: parseInt(formData.get('qte')),
  };

  // On insère dans la table notifications au lieu de la table produits
  await db.insert(notifications).values({
    typeAction: type,
    produitId: produitId,
    details: JSON.stringify(detailsObj),
    statut: 'en_attente',
  });

  revalidatePath('/admin/notifications');
  return { success: true, message: "Demande envoyée à l'administrateur" };
}

// --- 2. FONCTION POUR L'ADMIN (Validation réelle) ---
export async function validateAction(notifId) {
  // 1. Récupérer la notification
  const [notif] = await db.select().from(notifications).where(eq(notifications.id, notifId));
  
  if (!notif || notif.statut !== 'en_attente') return;

  const data = JSON.parse(notif.details);

  if (notif.typeAction === 'ADD') {
    // Exécution réelle de l'ajout
    const newProduct = await db.insert(produits).values({
      nom: data.nom,
      categorieId: data.cat_id,
      prix: data.prix,
      quantiteStock: data.qte,
    }).returning();

    await db.insert(mouvements).values({
      produitId: newProduct[0].id,
      quantite: data.qte,
    });
  } 
  
  // 2. Marquer la notification comme validée
  await db.update(notifications)
    .set({ statut: 'valide' })
    .where(eq(notifications.id, notifId));

  revalidatePath('/produits');
  revalidatePath('/dashboard');
  revalidatePath('/admin/notifications');
}

// --- 3. FONCTION POUR L'ADMIN (Refus) ---
export async function rejectAction(notifId) {
  await db.update(notifications)
    .set({ statut: 'annule' })
    .where(eq(notifications.id, notifId));
    
  revalidatePath('/admin/notifications');
}