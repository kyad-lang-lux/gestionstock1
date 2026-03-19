import { redirect } from 'next/navigation';

export default function RootPage() {
  // Plus tard, on ajoutera une condition ici : 
  // "Si pas de session, redirect('/login')"
  redirect('/login');
}