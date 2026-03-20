'use client';
import { useState, useEffect } from 'react';
import '@/styles/dashboard.css';
import { saveProductAction, deleteProductAction, getProduitsAction, getCategoriesAction } from './actions';

export default function ProduitsPage() {
  const [produits, setProduits] = useState([]);
  const [listeCategories, setListeCategories] = useState([]); // Nouvel état pour les catégories
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    // On récupère les catégories ET les produits
    const [resProd, resCat] = await Promise.all([
      getProduitsAction(),
      getCategoriesAction()
    ]);

    if (resCat.success) setListeCategories(resCat.data);

    if (resProd.success) {
      const mapped = resProd.data.map(p => ({
        id: p.id,
        nom: p.nom,
        cat: p.categorieNom || 'Sans catégorie',
        categorieId: p.categorieId,
        qte: p.quantiteStock,
        prix: p.prix,
        date: p.dateAjout ? new Date(p.dateAjout).toLocaleDateString() : '-',
        status: p.quantiteStock <= 0 ? 'Rupture' : (p.quantiteStock < 5 ? 'Stock faible' : 'En stock')
      }));
      setProduits(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const produitsFiltrés = produits.filter(p => {
    const matchSearch = p.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCat === 'Tous' || p.cat === filterCat;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id) => {
    if(confirm("Supprimer ce produit définitivement ?")) {
      const res = await deleteProductAction(id);
      if(res.success) refreshData();
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
      id: editingProduct?.id,
      nom: formData.get('nom'),
      categorieId: formData.get('categorieId'), // On récupère l'ID sélectionné
      qte: formData.get('qte'),
      prix: formData.get('prix'),
    };

    const res = await saveProductAction(data);
    if (res.success) {
      closeModal();
      refreshData();
    } else {
      alert("Erreur : " + res.error);
    }
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="produits-container">
      <div className="page-header">
        <h1>Liste des produits</h1>
      </div>

      <div className="table-controls">
        <div className="search-wrapper">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select className="filter-select" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="Tous">Toutes les catégories</option>
            {listeCategories.map(c => (
              <option key={c.id} value={c.nom}>{c.nom}</option>
            ))}
          </select>
          <button className="add-btn" onClick={() => openModal()}>
            <i className="fas fa-plus"></i> Ajouter
          </button>
        </div>
      </div>

      <div className="table-responsive">
        {loading ? (
          <p style={{padding: '20px'}}>Chargement des données en cours...</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Quantité</th>
                <th>Prix</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {produitsFiltrés.map((p) => (
                <tr key={p.id}>
                  <td className="product-cell">
                    <div className="product-icon">📦</div>
                    <span>{p.nom}</span>
                  </td>
                  <td className="category-text">{p.cat}</td>
                  <td><strong>{p.qte}</strong></td>
                  <td><strong>{p.prix.toLocaleString()} FCFA</strong></td>
                  <td>{p.date}</td>
                  <td>
                    <span className={`status-badge ${p.status.toLowerCase().replace(' ', '-')}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="action-icon" onClick={() => openModal(p)}><i className="fas fa-pen"></i></button>
                    <button className="action-icon delete" onClick={() => handleDelete(p.id)}><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
              <button onClick={closeModal} className="close-modal">&times;</button>
            </div>
            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label>Nom du produit</label>
                <input name="nom" defaultValue={editingProduct?.nom} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Catégorie</label>
                  <select name="categorieId" defaultValue={editingProduct?.categorieId}>
                    {listeCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Prix (FCFA)</label>
                  <input name="prix" type="number" step="0.01" defaultValue={editingProduct?.prix} required />
                </div>
              </div>
              <div className="form-group">
                <label>Quantité en stock</label>
                <input name="qte" type="number" defaultValue={editingProduct?.qte} required />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-secondary">Annuler</button>
                <button type="submit" className="add-btn">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}