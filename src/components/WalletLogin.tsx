import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, MessageCircle, Hash, Send, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

const WalletLogin: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'gie-code' | 'whatsapp-code'>('gie-code');
  const [gieCode, setGieCode] = useState('');
  const [whatsappCode, setWhatsappCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const handleGieCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.feveo2025.sn/api/wallet/verify-gie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gieCode, phoneNumber: '221772488807' }),
      });

      const data = await response.json();

      if (data.success) {
        setWhatsappNumber(data.data.whatsappNumber || '+221 7X XXX XX XX');
        setStep('whatsapp-code');
        
        // Afficher le code de secours si disponible
        if (data.data.backupCode) {
          setError(`Code WhatsApp envoyé. Code de secours: ${data.data.backupCode} (si WhatsApp n'arrive pas)`);
        }
      } else {
        setError(data.message || 'Code GIE invalide. Veuillez vérifier et réessayer.');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsappCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.feveo2025.sn/api/wallet/verify-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gieCode, whatsappCode }),
      });

      const data = await response.json();

      if (data.success) {
        // Stocker les données du wallet pour le dashboard
        localStorage.setItem('walletData', JSON.stringify(data.data.wallet));
        localStorage.setItem('walletSession', data.data.sessionToken);
        navigate('/wallet/dashboard');
      } else {
        setError(data.message || 'Code WhatsApp invalide. Veuillez vérifier et réessayer.');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendWhatsappCode = async () => {
    setIsLoading(true);
    try {
      // TODO: Renvoyer le code WhatsApp
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Code renvoyé par WhatsApp');
    } catch (error) {
      setError('Erreur lors du renvoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-accent-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-success-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-4000"></div>
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full p-1">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-3">
            {step === 'gie-code' ? 'Wallet FEVEO 2050' : 'Vérification Sécurisée'}
          </h1>
          
          <p className="text-neutral-600 leading-relaxed">
            {step === 'gie-code' 
              ? 'Accédez à votre portefeuille numérique sécurisé avec votre code GIE'
              : 'Confirmez votre identité avec le code reçu par WhatsApp'
            }
          </p>
        </div>

        {/* Indicateur de progression */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'gie-code' 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                : 'bg-success-500 text-white'
            }`}>
              {step === 'whatsapp-code' ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-16 h-1 rounded-full ${
              step === 'whatsapp-code' ? 'bg-success-500' : 'bg-neutral-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'whatsapp-code' 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' 
                : 'bg-neutral-200 text-neutral-500'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Messages d'erreur/succès */}
        {error && (
          <div className={`border-l-4 px-4 py-3 rounded-r-lg mb-6 ${
            error.includes('Code de secours') 
              ? 'bg-accent-50 border-accent-400 text-accent-800' 
              : 'bg-red-50 border-red-400 text-red-700'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {error.includes('Code de secours') ? (
                  <Shield className="w-5 h-5 text-accent-500 mt-0.5" />
                ) : (
                  <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        )}

        {step === 'gie-code' ? (
          <form onSubmit={handleGieCodeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Code d'Identification GIE
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Hash className="text-primary-500 w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={gieCode}
                  onChange={(e) => setGieCode(e.target.value.toUpperCase())}
                  className="w-full pl-12 pr-4 py-4 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 uppercase tracking-wider text-lg font-mono transition-all duration-200 bg-neutral-50/50"
                  placeholder="FEVEO-XX-XX-XX-XX-XXX"
                  pattern="FEVEO-\d{2}-\d{2}-\d{2}-\d{2}-\d{3}"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2 flex items-center">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                Format attendu : FEVEO-01-01-01-01-001
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || gieCode.length < 19}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Vérification...</span>
                </div>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Envoyer code WhatsApp
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Notification WhatsApp */}
            <div className="bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-200 p-5 rounded-xl">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-success-500 p-2 rounded-full">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-success-800 mb-1">Code envoyé avec succès</p>
                <p className="text-success-700 text-sm">
                  Vérifiez votre WhatsApp au <span className="font-mono font-bold">{whatsappNumber}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleWhatsappCodeSubmit}>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                  Code de vérification WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={whatsappCode}
                  onChange={(e) => setWhatsappCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-5 border-2 border-neutral-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 text-center text-2xl tracking-[0.5em] font-mono font-bold transition-all duration-200 bg-neutral-50/50"
                  placeholder="• • • • • •"
                  maxLength={6}
                />
                <p className="text-xs text-neutral-500 mt-2 text-center">
                  Saisissez le code à 6 chiffres reçu par WhatsApp
                </p>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('gie-code')}
                  className="flex-1 bg-neutral-100 text-neutral-700 py-4 px-4 rounded-xl hover:bg-neutral-200 focus:outline-none focus:ring-4 focus:ring-neutral-300/30 flex items-center justify-center font-semibold transition-all duration-200 border-2 border-neutral-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading || whatsappCode.length !== 6}
                  className="flex-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[140px]"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    'Accéder au Wallet'
                  )}
                </button>
              </div>
            </form>

            {/* Bouton renvoyer */}
            <div className="text-center pt-4 border-t border-neutral-100">
              <button
                onClick={resendWhatsappCode}
                disabled={isLoading}
                className="text-primary-600 hover:text-primary-800 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
              >
                Renvoyer le code
              </button>
            </div>
          </div>
        )}

        {/* Bouton retour à l'accueil */}
        <div className="mt-8 text-center pt-6 border-t border-neutral-100">
          <button
            onClick={() => navigate('/')}
            className="text-neutral-600 hover:text-primary-600 font-semibold flex items-center justify-center mx-auto transition-all duration-200 px-4 py-2 rounded-lg hover:bg-neutral-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletLogin;
