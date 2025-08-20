import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const reference = params.get('ref');

  useEffect(() => {
    const timer = setTimeout(() => {
      window.close();
      // Si la fenêtre ne se ferme pas, rediriger vers l'accueil
      navigate('/', { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        padding: 32,
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, color: '#28a745', marginBottom: 16 }}>✅</div>
        <h2 style={{ color: '#28a745', margin: 0 }}>Paiement confirmé !</h2>
        <p style={{ margin: '16px 0' }}>Votre transaction a été traitée avec succès.</p>
        {reference && (
          <div style={{
            background: '#f1f1f1',
            padding: 10,
            borderRadius: 5,
            fontFamily: 'monospace',
            margin: '20px 0',
          }}>
            Référence : {reference}
          </div>
        )}
        <p>Cette fenêtre se fermera automatiquement dans 2 secondes...</p>
        <div style={{ width: '100%', height: 6, background: '#e9ecef', borderRadius: 3, marginTop: 20, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '100%', background: '#28a745', animation: 'countdown 2s linear forwards' }} />
        </div>
        <style>{`
          @keyframes countdown {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
