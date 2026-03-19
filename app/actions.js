'use server';
import { db } from '@/db';
import { produits, mouvements } from '@/db/schema.js';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData) {
  const nom = formData.get('nom');
  const qte = parseInt(formData.get('qte'));
  
  // 1. Insérer le produit
  const newProduct = await db.insert(produits).values({
    nom: nom,
    categorieId: parseInt(formData.get('cat_id')),
    prix: parseFloat(formData.get('prix')),
    quantiteStock: qte,
  }).returning();

  // 2. Créer un mouvement initial
  await db.insert(mouvements).values({
    produitId: newProduct[0].id,
    quantite: qte,
  });

  revalidatePath('/produits');
  revalidatePath('/dashboard');
}