import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthContext } from '../../contexts/AdminAuthContext';
import '../../styles/AdminLogin.css';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading } = useAdminAuthContext();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login({ email, motDePasse });
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <form onSubmit={handleSubmit} className="admin-login-form">
          <h1 className="admin-login-title">Administration FEVEO 2050</h1>
          
          <p className="admin-login-subtitle">
            Connexion au panel administrateur
          </p>

          {error && (
            <div className="admin-login-error">
              <p>{error}</p>
              <button type="button" onClick={clearError} className="admin-login-error-close">×</button>
            </div>
          )}

          <div className="admin-login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="admin-login-input"
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              autoComplete="current-password"
              className="admin-login-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="admin-login-button"
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
