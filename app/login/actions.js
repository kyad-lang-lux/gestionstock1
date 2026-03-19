'use server';

import { db } from "@/db/index.js";
import { users } from "@/db/schema.js";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers"; // Ne change pas

export async function loginAction(formData) {
  const username = formData.get('username');
  const password = formData.get('password');

  const userExists = await db.select()
    .from(users)
    .where(
      and(
        eq(users.username, username),
        eq(users.password, password)
      )
    )
    .limit(1);

  if (userExists.length > 0) {
    // CORRECT : On attend (await) que les cookies soient prêts
    const cookieStore = await cookies(); 
    
    cookieStore.set('user_session', userExists[0].id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 jour
      path: '/',
    });

    return { success: true };
  } else {
    return { success: false, error: "Identifiants invalides" };
  }
}