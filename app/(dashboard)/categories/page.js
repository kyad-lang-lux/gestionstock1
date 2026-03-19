'use client';
import { useState, useEffect } from 'react';
import '@/styles/dashboard.css';
import { getCategoriesAction, addCategoryAction, deleteCategoryAction } from './actions';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    const res = await getCategoriesAction();
    if (res.success) setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const categoriesFiltrees = categories.filter(c =>
    c.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = new FormData(e.target).get('cat_name');
    const res = await addCategoryAction(name);
    if (res.success) {
      setIsModalOpen(false);
      refreshData();
    } else {
      alert("Erreur : " + res.error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer cette catégorie ? Les produits liés ne seront pas supprimés mais n'auront plus de catégorie.")) {
      const res = await deleteCategoryAction(id);
      if (res.success) refreshData();
    }
  };

  return (
    <div className="categories-container">
      <div className="page-header-row">
        <div className="header-left">
          <h1>Catégories</h1>
          <span className="subtitle">{categories.length} catégories au total</span>
        </div>
        <button className="add-btn-primary" onClick={() => setIsModalOpen(true)}>
          <i className="fas fa-plus"></i> Nouvelle catégorie
        </button>
      </div>

      <div className="search-bar-standalone">
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Rechercher une catégorie..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{padding: '20px'}}>Chargement des catégories...</p>
      ) : (
        <div className="categories-grid">
          {categoriesFiltrees.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="category-icon-wrapper">
                <i className="fas fa-folder"></i>
              </div>
              <div className="category-info">
                <h3>{cat.nom}</h3>
                <p>{cat.count || 0} produits</p>
              </div>
              <div className="category-actions">
                  <button onClick={() => handleDelete(cat.id)} title="Supprimer" style={{color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer'}}>
                    <i className="fas fa-trash"></i>
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale d'ajout */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <div className="modal-header">
              <h2>Nouvelle catégorie</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-modal">&times;</button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label>Nom de la catégorie</label>
                <input name="cat_name" required placeholder="ex: Périphériques" autoFocus />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Annuler</button>
                <button type="submit" className="add-btn">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}