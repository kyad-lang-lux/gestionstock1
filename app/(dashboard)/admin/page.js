"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import '@/styles/dashboard.css'; // Assure-toi que le CSS est bien ici

export default function AdminLoginPage() {
  const [auth, setAuth] = useState({ user: "", pass: "" });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token === "true") {
      router.push("/admin/notifications");
    }
  }, [router]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (auth.user === "admin" && auth.pass === "admin@electro") {
      localStorage.setItem("admin_token", "true");
      router.push("/admin/notifications");
    } else {
      alert("Identifiants Admin incorrects !");
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="login-card">
        <div className="login-header">
          <h2>Connexion Propriétaire</h2>
          <p>Espace de validation du stock</p>
        </div>
        
        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <input 
            type="text" 
            className="admin-input"
            placeholder="Nom d'utilisateur" 
            onChange={(e) => setAuth({...auth, user: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input 
            type="password" 
            className="admin-input"
            placeholder="••••••••" 
            onChange={(e) => setAuth({...auth, pass: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="btn-admin-login">
          Accéder aux validations
        </button>
      </form>
    </div>
  );
}