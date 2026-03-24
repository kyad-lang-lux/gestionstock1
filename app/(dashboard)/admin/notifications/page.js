'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { 
  validateAction, 
  rejectAction, 
  getPendingNotificationsAction 
} from "@/app/(dashboard)/produits/actions";

export default function AdminNotifications() {
  const [allNotifs, setAllNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token !== "true") {
      router.push("/admin");
    } else {
      fetchNotifs();
    }
  }, []);

  const fetchNotifs = async () => {
    const res = await getPendingNotificationsAction();
    if (res.success) setAllNotifs(res.data);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  if (loading) return (
    <div className="flex-center" style={{height: '100vh'}}>
      <div className="loader"></div>
      <p>Vérification de l'accès...</p>
    </div>
  );

  return (
    <div className="notifications-container">
      {/* Header Section */}
      <header className="notif-header">
        <div className="header-text">
          <h1>Validations en attente</h1>
          <p>{allNotifs.length} demande(s) à traiter</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Déconnexion
        </button>
      </header>
      
      {/* Notifications List */}
      <div className="notif-grid">
        {allNotifs.map((n) => {
          const data = JSON.parse(n.details);
          const isDelete = n.typeAction === 'DELETE';

          return (
            <div key={n.id} className={`notif-card ${isDelete ? 'border-red' : 'border-blue'}`}>
              <div className="notif-content">
                <div className="notif-info">
                  <span className={`badge ${isDelete ? 'badge-red' : 'badge-blue'}`}>
                    {n.typeAction}
                  </span>
                  <h3 className="product-name">{data.nom}</h3>
                  
                  {!isDelete ? (
                    <div className="product-details">
                      <span><strong>Stock:</strong> {data.qte}</span>
                      <span className="separator">|</span>
                      <span><strong>Prix:</strong> {data.prix?.toLocaleString()} FCFA</span>
                    </div>
                  ) : (
                    <p className="delete-warning">Suppression définitive du catalogue</p>
                  )}
                </div>

                <div className="notif-actions">
                  <button 
                    onClick={async () => { await validateAction(n.id); fetchNotifs(); }}
                    className="btn-approve"
                  >
                    {isDelete ? 'Confirmer' : 'Accepter'}
                  </button>
                  <button 
                    onClick={async () => { await rejectAction(n.id); fetchNotifs(); }}
                    className="btn-reject"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {allNotifs.length === 0 && (
          <div className="empty-state">
            <p>Toutes les demandes ont été traitées. Bon travail ! ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}