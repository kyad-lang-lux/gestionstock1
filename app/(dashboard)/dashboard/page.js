import '../../../styles/dashboard.css';
import { db } from "@/db/index.js";
import { produits, categories } from "@/db/schema.js";
import { sql, eq } from "drizzle-orm";

export default async function DashboardPage() {
  // 1. Récupération des données en parallèle
  const [resProduits, resCategories, resFaible, resRupture, topProduits] = await Promise.all([
    db.select({ count: sql`count(*)` }).from(produits),
    db.select({ count: sql`count(*)` }).from(categories),
    db.select({ count: sql`count(*)` })
      .from(produits)
      .where(sql`${produits.quantiteStock} <= ${produits.seuilAlerte} AND ${produits.quantiteStock} > 0`),
    db.select({ count: sql`count(*)` })
      .from(produits)
      .where(eq(produits.quantiteStock, 0)),
    db.select({ nom: produits.nom, stock: produits.quantiteStock })
      .from(produits)
      .orderBy(sql`${produits.quantiteStock} DESC`)
      .limit(5)
  ]);

  const totalProduits = resProduits[0]?.count || 0;
  const totalCategories = resCategories[0]?.count || 0;
  const stockFaible = resFaible[0]?.count || 0;
  const rupture = resRupture[0]?.count || 0;
  const sain = Math.max(0, totalProduits - rupture - stockFaible);

  const maxStock = Math.max(...topProduits.map(p => p.stock), 1);

  return (
    <div className="dashboard-content" style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Dashboard</h1>
      </div>

      {/* Cartes de Statistiques - Déjà gérées par ton CSS dashboard.css normalement */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-info"><span>Produits</span><h2>{totalProduits}</h2></div>
          <div className="stat-icon"><i className="fas fa-box"></i></div>
        </div>
        <div className="stat-card red">
          <div className="stat-info"><span>Rupture</span><h2>{rupture}</h2></div>
          <div className="stat-icon"><i className="fas fa-exclamation-triangle"></i></div>
        </div>
        <div className="stat-card orange">
          <div className="stat-info"><span>Faible</span><h2>{stockFaible}</h2></div>
          <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
        </div>
        <div className="stat-card white">
          <div className="stat-info"><span>Catégories</span><h2>{totalCategories}</h2></div>
          <div className="stat-icon"><i className="fas fa-folder"></i></div>
        </div>
      </div>

      {/* ZONE DES GRAPHIQUES RESPONSIVE */}
      <div className="charts-wrapper" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '20px', 
        marginTop: '30px' 
      }}>
        
        {/* Graphique 1 : Top 5 Stocks */}
        <div className="chart-card" style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          minHeight: '350px'
        }}>
          <h3 style={{ marginBottom: '25px', color: '#1e293b', fontSize: '1.1rem' }}>Top 5 Stocks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {topProduits.map((p, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                  <span style={{ fontWeight: '500', color: '#334155' }}>{p.nom}</span>
                  <span>{p.stock} pcs</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px' }}>
                  <div style={{ 
                    width: `${(p.stock / maxStock) * 100}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #3b82f6, #2dd4bf)',
                    borderRadius: '10px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graphique 2 : Santé du Stock */}
        <div className="chart-card" style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ marginBottom: '25px', color: '#1e293b', fontSize: '1.1rem' }}>Répartition du Stock</h3>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-around', 
            gap: '10px',
            minHeight: '200px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <BarItem label="Rupture" val={rupture} total={totalProduits} color="#f87171" />
            <BarItem label="Faible" val={stockFaible} total={totalProduits} color="#fbbf24" />
            <BarItem label="Sain" val={sain} total={totalProduits} color="#34d399" />
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
            Analyse globale sur {totalProduits} références
          </p>
        </div>

      </div>
    </div>
  );
}

// Petit composant interne pour les barres verticales (BarItem)
function BarItem({ label, val, total, color }) {
  const height = total > 0 ? Math.max((val / total) * 150, 5) : 5;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <span style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '5px' }}>{val}</span>
      <div style={{ 
        height: `${height}px`, 
        width: '80%', 
        maxWidth: '40px', 
        backgroundColor: color, 
        borderRadius: '6px 6px 0 0',
        transition: 'height 0.3s ease'
      }}></div>
      <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '8px' }}>{label}</span>
    </div>
  );
} 