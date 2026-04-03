'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import pour détecter la page active
import '@/styles/dashboard.css';

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Récupère l'URL actuelle

  // Fonction pour vérifier si le lien est actif
  const isActive = (path) => pathname === path ? 'active' : '';

  return (
    <div className="dashboard-container">
      {/* Overlay Mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <i className="fa-solid fa-computer"></i>
          <span>Electro & Meuble</span>
        </div>
        
        <nav className="sidebar-nav">
          <Link href="/dashboard" className={`nav-item ${isActive('/dashboard')}`} onClick={() => setIsOpen(false)}>
            <i className="fas fa-th-large"></i> <span>Dashboard</span>
          </Link>
          <Link href="/produits" className={`nav-item ${isActive('/produits')}`} onClick={() => setIsOpen(false)}>
            <i className="fas fa-box"></i> <span>Produits</span>
          </Link>
          <Link href="/categories" className={`nav-item ${isActive('/categories')}`} onClick={() => setIsOpen(false)}>
            <i className="fas fa-folder"></i> <span>Catégories</span>
          </Link>
          
          <div className="nav-separator"></div>
          <Link href="/admin/notifications" className={`nav-item ${isActive('/admin/notifications')}`} onClick={() => setIsOpen(false)}>
  <i className="fas fa-user-shield"></i> <span>Espace Admin</span>
</Link>
          <Link href="/parametres" className={`nav-item ${isActive('/parametres')}`} onClick={() => setIsOpen(false)}>
            <i className="fas fa-cog"></i> <span>Paramètres</span>
          </Link>
        </nav>
        
       
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setIsOpen(true)}>
              <i className="fas fa-bars"></i>
            </button>
           
          </div>

          <div className="topbar-right">
            <div className="notifications">
              <i className="far fa-bell"></i>
              <span className="badge-dot"></span>
            </div>
            <div className="user-profile-simple">
              <div className="avatar">E</div>
              <div className="user-details">
                <span className="username">Stock</span>
              </div>
            </div>
          </div>
        </header>

        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}