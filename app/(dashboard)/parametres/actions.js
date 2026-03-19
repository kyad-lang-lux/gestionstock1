'use server';

import { db } from "@/db/index.js";
import { users } from "@/db/schema.js";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Action de déconnexion
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('user_session'); // Supprime le cookie
  redirect('/login'); // Redirige immédiatement
}

// Action pour mettre à jour le nom d'utilisateur
export async function updateUsernameAction(newUsername) {
  try {
    if (!newUsername || newUsername.length < 3) {
      throw new Error("Le nom d'utilisateur doit contenir au moins 3 caractères.");
    }
    await db.update(users)
      .set({ username: newUsername })
      .where(eq(users.id, 1));

    revalidatePath('/parametres');
    return { success: true, message: "Nom d'utilisateur mis à jour !" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Action pour le mot de passe
export async function updatePasswordAction(oldPassword, newPassword) {
  try {
    if (newPassword.length < 8) {
      throw new Error("Le nouveau mot de passe doit faire au moins 8 caractères.");
    }
    await db.update(users)
      .set({ password: newPassword })
      .where(eq(users.id, 1));

    return { success: true, message: "Mot de passe modifié avec succès !" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}