import '../../../styles/dashboard.css';
import { db } from "@/db/index.js";
import { produits, categories } from "@/db/schema.js";
import { sql, eq, lt } from "drizzle-orm";

export default async function DashboardPage() {
  // 1. Récupération des données en parallèle pour plus de rapidité
  const [resProduits, resCategories, resFaible] = await Promise.all([
    // Compte total des produits
    db.select({ count: sql`count(*)` }).from(produits),
    // Compte total des catégories
    db.select({ count: sql`count(*)` }).from(categories),
    // Produits dont le stock est inférieur au seuil d'alerte (Stock faible)
    db.select({ count: sql`count(*)` })
      .from(produits)
      .where(sql`${produits.quantiteStock} <= ${produits.seuilAlerte} AND ${produits.quantiteStock} > 0`),
    // Produits en rupture totale
    db.select({ count: sql`count(*)` })
      .from(produits)
      .where(eq(produits.quantiteStock, 0))
  ]);

  // Extraction des valeurs (Drizzle retourne toujours un tableau)
  const totalProduits = resProduits[0]?.count || 0;
  const totalCategories = resCategories[0]?.count || 0;
  const stockFaible = resFaible[0]?.count || 0;
  
  // Pour la rupture, on peut aussi le faire comme ça :
  const resRupture = await db.select({ count: sql`count(*)` })
    .from(produits)
    .where(eq(produits.quantiteStock, 0));
  const rupture = resRupture[0]?.count || 0;

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      {/* Cartes de Statistiques Dynamiques */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-info">
            <span>Produits en stock</span>
            <h2>{totalProduits}</h2>
            <p className="trend positive">Données réelles</p>
          </div>
          <div className="stat-icon">
            <i className="fas fa-box"></i>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-info">
            <span>En rupture</span>
            <h2>{rupture}</h2>
          </div>
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-info">
            <span>Stock faible</span>
            <h2>{stockFaible}</h2>
            <p className="trend">Alerte seuil</p>
          </div>
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>

        <div className="stat-card white">
          <div className="stat-info">
            <span>Catégories</span>
            <h2>{totalCategories}</h2>
          </div>
          <div className="stat-icon"> 
            <i className="fas fa-folder"></i>
          </div>
        </div>
      </div>

      {/* Zone des Graphiques */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Évolution du stock</h3>
          <div className="chart-placeholder line-chart">
             <p>Graphique lié aux mouvements Turso</p>
          </div>
        </div>
        <div className="chart-container">
          <h3>Mouvements récents</h3>
          <div className="chart-placeholder bar-chart">
             <p>Dernières entrées/sorties</p>
          </div>
        </div>
      </div>
    </div>
  );
}