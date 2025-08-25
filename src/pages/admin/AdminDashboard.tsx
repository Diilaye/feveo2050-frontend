import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthContext } from '../../contexts/AdminAuthContext';
import { adminService, DashboardData } from '../../services/adminService';
import '../../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { admin, isAuthenticated, logout } = useAdminAuthContext();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Charger les données du tableau de bord
  useEffect(() => {
    if (isAuthenticated) {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const response = await adminService.getDashboardData();
          if (response.success && response.data) {
            setDashboardData(response.data);
          } else {
            setError(response.message || 'Erreur lors du chargement des données');
          }
        } catch (error: any) {
          setError(error.message || 'Erreur lors du chargement des données');
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !admin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-logo">FEVEO 2050 | Administration</div>
        <div className="admin-user-info">
          <span>{admin.prenom} {admin.nom}</span>
          <button onClick={logout} className="logout-button">Déconnexion</button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav>
            <ul>
              <li><a href="/admin/dashboard">Tableau de bord</a></li>
              <li><a href="/admin/users">Utilisateurs</a></li>
              <li><a href="/admin/gie">Gestion GIE</a></li>
              <li><a href="/admin/investissements">Investissements</a></li>
              <li><a href="/admin/rapports">Rapports</a></li>
              <li><a href="/admin/configuration">Configuration</a></li>
            </ul>
          </nav>
        </div>

        <main className="admin-main">
          <h1>Tableau de bord administrateur</h1>
          <p>Bienvenue, {admin.prenom} {admin.nom}!</p>

          {loading ? (
            <div className="loading-indicator">Chargement des données...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="admin-stats">
                <div className="stat-card">
                  <h3>Utilisateurs</h3>
                  <p className="stat-value">{dashboardData?.stats.utilisateurs || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>GIE</h3>
                  <p className="stat-value">{dashboardData?.stats.gies || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Investissements</h3>
                  <p className="stat-value">{dashboardData?.stats.investissements || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Transactions</h3>
                  <p className="stat-value">{dashboardData?.stats.transactions || 0}</p>
                </div>
              </div>

              <section className="admin-recent-activity">
                <h2>Utilisateurs récents</h2>
                {dashboardData?.recent.utilisateurs && dashboardData.recent.utilisateurs.length > 0 ? (
                  <ul className="activity-list">
                    {dashboardData.recent.utilisateurs.map((user, index) => (
                      <li key={index}>{user.prenom} {user.nom} ({user.email}) - {user.role}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun utilisateur récent à afficher.</p>
                )}
              </section>
              
              <section className="admin-recent-activity">
                <h2>GIE récents</h2>
                {dashboardData?.recent.gies && dashboardData.recent.gies.length > 0 ? (
                  <ul className="activity-list">
                    {dashboardData.recent.gies.map((gie, index) => (
                      <li key={index}>{gie.nomGIE} ({gie.identifiantGIE})</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun GIE récent à afficher.</p>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
