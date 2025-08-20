import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, MessageCircle, Hash, Send, ArrowLeft, Shield, CheckCircle, CreditCard, ExternalLink } from 'lucide-react';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3051/api';

const WalletLogin: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'gie-code' | 'whatsapp-code'>('gie-code');
  const [gieCode, setGieCode] = useState('');
  const [whatsappCode, setWhatsappCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [whatsappFailed, setWhatsappFailed] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const handleGieCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/wallet/verify-gie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gieCode }),
      });

      const data = await response.json();

      console.log('Données GIE:', data);

      if (data.success) {
        // Vérifier si le statut d'enregistrement n'est pas validé
        if (data.data.gieInfo && data.data.gieInfo.statutEnregistrement !== 'valide') {
          console.log('GIE non validé, création d\'une transaction d\'adhésion');
          
          try {
            // Initialisation d'une transaction d'adhésion
            const transactionResponse = await fetch(`${BASE_URL}/transactions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount:  20200, // Montant des frais d'adhésion
                method: 'WAVE', // Méthode de paiement par défaut
                gieCode: gieCode, // Code du GIE
                operationType: 'ADHESION' // Type d'opération pour l'adhésion
              })
            });

            const transactionResult = await transactionResponse.json();
            
            if (transactionResult.status === 'OK' && transactionResult.data) {
              // Mettre à jour les données de paiement avec la nouvelle transaction
              setPaymentRequired(true);
              setPaymentData({
                ...data.data,
                payment: {
                  ...data.data.payment,
                  transactionId: transactionResult.data.reference,
                  paymentUrl: transactionResult.data.paymentInfo?.links?.payment
                }
              });
              setStep('whatsapp-code'); // Afficher l'interface de paiement
              return;
            } else {
              setError(transactionResult.message || 'Erreur lors de la création de la transaction d\'adhésion');
              setIsLoading(false);
              return;
            }
          } catch (transactionError) {
            console.error('Erreur création transaction:', transactionError);
            setError('Erreur lors de la création de la transaction d\'adhésion. Veuillez réessayer.');
            setIsLoading(false);
            return;
          }
        }
        
        // Vérifier si un paiement est requis (cas standard)
        if (data.requiresPayment) {
          setPaymentRequired(false);
         // setPaymentData(data.data);
          setStep('whatsapp-code'); // Utiliser l'étape 2 pour afficher le paiement
          setError(''); // Nettoyer les erreurs
          return;
        }
        
        setWhatsappNumber(data.data.whatsappNumber || '+221 7X XXX XX XX');
        setStep('whatsapp-code');
        
        // Stocker le code de secours si disponible
        if (data.data.backupCode) {
          setBackupCode(data.data.backupCode);
        }
        
        // Vérifier si l'envoi WhatsApp a échoué
        if (data.data.whatsappSent === false) {
          setWhatsappFailed(true);
          setError(`Impossible d'envoyer le code par WhatsApp. Utilisez le code affiché ci-dessous.`);
        } else if (data.data.backupCode) {
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
      const response = await fetch(`${BASE_URL}/wallet/verify-whatsapp`, {
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
        // Gérer les différents types d'erreurs
        if (data.message?.includes('expiré') || data.message?.includes('invalide')) {
          setError('Le code a expiré ou est invalide. Cliquez sur "Renvoyer le code" pour en générer un nouveau.');
        } else if (data.message?.includes('Code WhatsApp invalide')) {
          setError('Code incorrect. Vérifiez le code à 6 chiffres et réessayez.');
        } else {
          setError(data.message || 'Erreur de vérification. Veuillez réessayer.');
        }
      }
    } catch (error) {
      // En cas d'erreur de connexion, gérer automatiquement avec code de secours
      setWhatsappFailed(true);
      const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
      setBackupCode(tempCode);
      setError('Erreur de connexion ou code expiré. Utilisez le code de secours affiché ci-dessous ou recommencez avec votre code GIE.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendWhatsappCode = async () => {
    setIsLoading(true);
    setError('');
    setWhatsappFailed(false);
    
    try {
      const response = await fetch(`${BASE_URL}/wallet/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gieCode }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.whatsappSent === false) {
          setWhatsappFailed(true);
          setBackupCode(data.data.backupCode);
          setError(`Impossible d'envoyer le code par WhatsApp. Utilisez le code affiché ci-dessous.`);
        } else {
          setError('Code renvoyé avec succès par WhatsApp');
        }
      } else {
        setError('Erreur lors du renvoi du code');
      }
    } catch (error) {
      setWhatsappFailed(true);
      // Générer un code temporaire en cas d'erreur de connexion
      const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
      setBackupCode(tempCode);
      setError('Erreur de connexion. Utilisez le code temporaire affiché ci-dessous.');
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
            error.includes('Code de secours') || error.includes('temporaire') || whatsappFailed
              ? 'bg-amber-50 border-amber-400 text-amber-800' 
              : error.includes('succès')
              ? 'bg-success-50 border-success-400 text-success-800'
              : 'bg-red-50 border-red-400 text-red-700'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {error.includes('Code de secours') || error.includes('temporaire') || whatsappFailed ? (
                  <Shield className="w-5 h-5 text-amber-500 mt-0.5" />
                ) : error.includes('succès') ? (
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5" />
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
              <div className="text-xs text-neutral-500 mt-2 flex items-center">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                Format attendu : FEVEO-01-01-01-01-001
              </div>
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
            {/* Interface de paiement requis */}
            {paymentRequired ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 p-6 rounded-xl">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-amber-500 p-3 rounded-full">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-amber-800 text-lg mb-2">Paiement d'activation requis</h3>
                    <p className="text-amber-700 mb-4">
                      Votre GIE <strong>{paymentData?.gieInfo?.nom}</strong> nécessite un paiement d'activation pour accéder au wallet.
                    </p>
                    
                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}
                    
                    <div className="bg-white/70 border-2 border-amber-300 rounded-lg p-4 mb-4">
                      <div className="text-2xl font-bold text-amber-900 mb-2">
                        {paymentData?.payment?.amount?.toLocaleString()} FCFA
                      </div>
                      <p className="text-sm text-amber-700">
                        Frais d'adhésion FEVEO 2050
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={async () => {
                          setIsLoading(true);
                          setError('');
                          try {
                            console.log('Création de la transaction...');
                            // Créer une transaction d'adhésion
                            const response = await fetch(`${BASE_URL}/transactions`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                amount: 20200, // Montant des frais d'adhésion
                                method: 'WAVE', // Méthode de paiement par défaut
                                gieCode: gieCode, // Code du GIE
                                operationType: 'ADHESION' // Type d'opération pour l'adhésion
                              })
                            });

                            const result = await response.json();

                            console.log('Résultat création transaction:', result);
                            
                            if (result.status === 'OK' && result.data) {
                              // Mettre à jour les données de paiement
                             const fallbackUrl = result.data.urlWave;
                             window.open(fallbackUrl, '_blank');
                            } else {
                              setError(result.message || 'Erreur lors de la création de la transaction');
                            }
                          } catch (error) {
                            console.error('Erreur transaction:', error);
                            setError('Erreur de connexion. Veuillez réessayer.');
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6 rounded-xl hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-500/30 flex items-center justify-center font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        ) : (
                          <CreditCard className="w-5 h-5 mr-3" />
                        )}
                        Payer avec Wave
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </button>
                      
                      <p className="text-xs text-amber-600">
                        Transaction ID: {paymentData?.payment?.transactionId}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-4">
                    Après avoir effectué le paiement, revenez ici et cliquez sur "Vérifier le paiement"
                  </p>
                  
                  <button
                    onClick={async () => {
                      // Fonction pour vérifier le paiement
                      setIsLoading(true);
                      try {
                        // Vérifier si nous avons une transaction créée localement
                        const transactionId = paymentData?.payment?.transactionId;
                        
                        if (!transactionId) {
                          setError('Aucune transaction à vérifier. Veuillez créer un paiement d\'abord.');
                          setIsLoading(false);
                          return;
                        }
                        
                        // Vérifier le statut de la transaction
                        const response = await fetch(`${BASE_URL}/wallet/confirm-payment`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            transactionId: transactionId,
                            gieCode: gieCode
                          })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                          setError('');
                          setPaymentRequired(false);
                          // Relancer la vérification GIE pour obtenir le code WhatsApp
                          handleGieCodeSubmit({ preventDefault: () => {} } as React.FormEvent);
                        } else {
                          setError(result.message || 'Paiement non confirmé. Veuillez vérifier votre transaction.');
                        }
                      } catch (error) {
                        console.error('Erreur vérification:', error);
                        setError('Erreur lors de la vérification du paiement.');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-success-600 to-success-700 text-white py-3 px-6 rounded-xl hover:from-success-700 hover:to-success-800 focus:outline-none focus:ring-4 focus:ring-success-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 mx-auto"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    ) : (
                      <CheckCircle className="w-5 h-5 mr-3" />
                    )}
                    Vérifier le paiement
                  </button>
                </div>
                
                <div className="text-center pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      setStep('gie-code');
                      setPaymentRequired(false);
                      setPaymentData(null);
                      setError('');
                    }}
                    className="text-neutral-600 hover:text-primary-600 font-semibold flex items-center justify-center mx-auto transition-all duration-200 px-4 py-2 rounded-lg hover:bg-neutral-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au code GIE
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Notification WhatsApp ou Code de secours */}
            {whatsappFailed ? (
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-200 p-5 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-amber-500 p-2 rounded-full">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-amber-800 mb-2">Code de sécurité temporaire</p>
                  <p className="text-amber-700 text-sm mb-4">
                    L'envoi par WhatsApp a échoué. Utilisez ce code :
                  </p>
                  <div className="bg-white/70 border-2 border-amber-300 rounded-lg p-4 mb-3">
                    <div className="text-3xl font-mono font-bold text-amber-900 tracking-[0.3em]">
                      {backupCode || '------'}
                    </div>
                  </div>
                  <p className="text-xs text-amber-600">
                    Saisissez ce code dans le champ ci-dessous
                  </p>
                </div>
              </div>
            ) : (
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
                  {backupCode && (
                    <div className="mt-3 pt-3 border-t border-success-200">
                      <p className="text-xs text-success-600 mb-2">Code de secours :</p>
                      <div className="bg-white/70 border border-success-300 rounded px-3 py-1 inline-block">
                        <span className="font-mono font-bold text-success-800">{backupCode}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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

            {/* Bouton renvoyer et options */}
            <div className="text-center pt-4 border-t border-neutral-100 space-y-3">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resendWhatsappCode}
                  disabled={isLoading}
                  className="text-primary-600 hover:text-primary-800 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
                >
                  Renvoyer le code
                </button>
                
                <button
                  onClick={() => {
                    setStep('gie-code');
                    setWhatsappCode('');
                    setBackupCode('');
                    setWhatsappFailed(false);
                    setError('');
                  }}
                  className="text-amber-600 hover:text-amber-800 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-amber-50 transition-all duration-200"
                >
                  Recommencer
                </button>
              </div>
              
              {!whatsappFailed && (
                <div>
                  <button
                    onClick={() => {
                      setWhatsappFailed(true);
                      // Générer un code de secours si pas déjà disponible
                      if (!backupCode) {
                        const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
                        setBackupCode(tempCode);
                      }
                      setError('Code de secours affiché. Utilisez-le si vous ne recevez pas le message WhatsApp.');
                    }}
                    className="block text-amber-600 hover:text-amber-800 font-medium text-xs px-3 py-1 rounded hover:bg-amber-50 transition-all duration-200 mx-auto"
                  >
                    Problème avec WhatsApp ? Afficher le code de secours
                  </button>
                </div>
              )}
              
              {whatsappFailed && (
                <div>
                  <button
                    onClick={() => {
                      setWhatsappFailed(false);
                      setError('');
                      resendWhatsappCode();
                    }}
                    className="block text-success-600 hover:text-success-800 font-medium text-xs px-3 py-1 rounded hover:bg-success-50 transition-all duration-200 mx-auto"
                  >
                    Réessayer l'envoi WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bouton retour à l'accueil */}
                    </div>
          )}
        </div>

        {/* Bouton retour à l'accueil */}
        <div className="mt-8 text-center pt-6 border-t border-neutral-100">
      </div>
    </div>
  );
};

export default WalletLogin;
