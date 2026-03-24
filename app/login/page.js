'use client';
import '../../styles/auth.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const result = await loginAction(formData);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-content">
          <div className="logo">
           <span>Ulrich Electronique & Services</span>
          </div>
          
          <h1>Bienvenue</h1>
          <p className="subtitle">Connectez-vous avec vos identifiants .</p>

          {error && (
            <div className="error-message" style={{
              color: '#721c24', 
              backgroundColor: '#f8d7da', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '15px',
              fontSize: '14px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nom d'utilisateur</label>
              <div className="input-wrapper">
                <i className="far fa-user"></i>
                <input 
                  name="username" 
                  type="text" 
                  placeholder="ex: admin" 
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                {/* Type text pour voir le mot de passe en clair */}
                <input 
                  name="password" 
                  type="text" 
                  placeholder="Entrez votre mot de passe" 
                  required 
                  style={{ paddingLeft: '15px' }} // Ajustement car plus d'icône à gauche
                />
              </div>
            </div>

            <div className="auth-options">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" /> Se souvenir de moi
              </label>
              {/* <a href="#">Mot de passe oublié ?</a> */}
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>

      <div className="auth-right">
        <div className="illustration-box">
           <i className="fas fa-cubes"></i>
        </div>
        <h2>Gérez votre stock en toute simplicité</h2>
        <p>Une solution moderne et intuitive pour les vendeurs de matériel informatique.</p>
      </div>
    </div>
  );
}