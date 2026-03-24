'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    
    // Si on n'est pas sur la page login et qu'il n'y a pas de token
    if (pathname !== '/admin' && token !== 'true') {
      router.push('/admin');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized && pathname !== '/admin') {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Vérification de l'accès...</div>;
  }

  return <>{children}</>;
}