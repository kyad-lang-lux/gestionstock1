'use client';

import { useState, useEffect } from 'react';
import '@/styles/dashboard.css';
import { updateUsernameAction, updatePasswordAction, logoutAction, getUserAction } from './actions';

export default function ParametresPage() {
  const [userName, setUserName] = useState('Chargement...');
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Charger le vrai nom depuis la base de données au chargement de la page
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserAction();
      if (res.success) {
        setUserName(res.username);
      } else {
        setUserName('Erreur');
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsPending(true);
    const result = await updateUsernameAction(userName);
    setIsPending(false);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsPending(true);
    const result = await updatePasswordAction(e.target.oldPass.value, e.target.newPass.value);
    setIsPending(false);
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      e.target.reset();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  return (
    <div className="settings-container">
      <div className="page-header">
        <h1>Mon Profil</h1>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} 
             style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', 
             backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
             color: message.type === 'success' ? '#155724' : '#721c24' }}>
          {message.text}
        </div>
      )}

      <div className="settings-grid">
        {/* SECTION IDENTITÉ */}
        <section className="settings-card">
          <div className="card-header">
            <i className="fas fa-user-circle"></i>
            <h2>Informations personnelles</h2>
          </div>
          <form onSubmit={handleUpdateProfile} className="settings-form">
            <div className="form-group">
              <label>Nom d'utilisateur</label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                required 
              />
            </div>
           
            <button type="submit" className="save-btn" disabled={isPending}>
              {isPending ? "Mise à jour..." : "Mettre à jour le nom"}
            </button>
          </form>
        </section>

        {/* SECTION SÉCURITÉ - MOT DE PASSE VISIBLE */}
        <section className="settings-card">
          <div className="card-header">
            <h2>Sécurité</h2>
          </div>
          <form onSubmit={handleUpdatePassword} className="settings-form">
            <div className="form-group">
              <label>Ancien mot de passe</label>
              {/* Type text pour que le mot de passe soit visible */}
              <input 
                name="oldPass" 
                type="text" 
                placeholder="Entrez l'ancien mot de passe" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              {/* Type text pour que le mot de passe soit visible */}
              <input 
                name="newPass" 
                type="text" 
                placeholder="Minimum 8 caractères" 
                required 
              />
            </div>
            <button type="submit" className="save-btn btn-outline" disabled={isPending}>
               Changer le mot de passe
            </button>
          </form>
        </section>

        <div className="logout-zone">
          <button className="full-logout-btn" onClick={() => logoutAction()}>
            <i className="fas fa-sign-out-alt"></i> Se déconnecter du compte
          </button>
        </div>
      </div>
    </div>
  );
}