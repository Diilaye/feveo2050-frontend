import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAdminAuthContext } from '../contexts/AdminAuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });

  const { error, isLoading, clearError } = useAdminAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (clearError) clearError();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3051/api';
      
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          motDePasse: formData.motDePasse
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion administrateur');
      }

      console.log("log data.token");
      console.log(data.data.token);

      if (data.success && data.data?.token) {
        // Stocker le token et les informations de l'administrateur
        localStorage.setItem('adminAuthToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.utilisateur));
        
        // Rediriger vers le tableau de bord
        navigate('/admin/dashboard');
        return true;
      } else {
        throw new Error(data.message || 'Connexion échouée');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setLoginError(error.message || 'Erreur lors de la connexion');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Bannière latérale avec logo et texte */}
      <div className="hidden md:flex md:w-1/2 bg-[url('/images/bg1.jpg')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-blue-900 opacity-90"></div>
        <div className="relative flex flex-col justify-center items-start p-16 w-full max-w-2xl ml-auto">
          <div className="flex items-center mb-10">
            <div className="p-3 bg-primary-600 rounded-lg shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="ml-4">
              <span className="text-2xl font-light text-white">FEVEO</span>
              <span className="text-2xl font-bold text-white">2050</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 leading-tight text-white">
            <span className="text-orange-300">Portail</span> d'Administration <br />Sécurisé
          </h1>
          
          <div className="w-20 h-1.5 bg-orange-500 rounded-full mb-8"></div>
          
          <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-lg">
            Accès exclusif aux fonctionnalités de gestion. Ce portail vous permet de gérer l'ensemble des données et paramètres du système FEVEO 2050.
          </p>
          
          <div className="bg-green-500 p-6 rounded-xl shadow-xl">
            <p className="text-sm text-white leading-relaxed italic">
              "La gestion efficace des données est la clé du succès d'un système d'investissement durable et transparent pour les communautés du Sénégal."
            </p>
            <div className="mt-4 flex items-center">
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white">AD</div>
              <div className="ml-2">
                <p className="text-sm font-medium text-white">Abdoulaye Diop</p>
                <p className="text-xs text-green-200">Directeur Exécutif</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Zone de formulaire */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md">
          {/* Logo mobile - visible uniquement sur petits écrans */}
          <div className="flex flex-col items-center md:items-start justify-center md:hidden mb-12">
            <div className="flex items-center">
              <div className="p-2 bg-primary-600 rounded-lg shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-xl font-light text-gray-900">FEVEO</span>
                <span className="text-xl font-bold text-gray-900">2050</span>
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-center text-gray-900">Portail d'Administration</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
            {/* En-tête du formulaire */}
            <div className="px-10 pt-10 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion sécurisée</h2>
              <p className="text-gray-600">Accédez à votre espace d'administration</p>
            </div>
            
            {/* Séparateur */}
            <div className="w-full h-px bg-gray-200"></div>
            
            {/* Formulaire */}
            <div className="px-10 py-10">
              {(error || loginError) && (
                <div className="mb-8 bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                  <div className="p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">{loginError || error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-12 pr-4 py-3.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white shadow-sm transition-all duration-200"
                      placeholder="administrateur@feveo2050.sn"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mot de passe
                    </label>
                    <button type="button" className="text-sm text-orange-500 hover:text-orange-700 font-medium transition-colors duration-200">
                      Mot de passe oublié?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="motDePasse"
                      id="password"
                      required
                      value={formData.motDePasse}
                      onChange={handleInputChange}
                      className="block w-full pl-12 pr-12 py-3.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 bg-white shadow-sm transition-all duration-200"
                      placeholder="••••••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                      >
                        {showPassword ? 
                          <EyeOff className="h-5 w-5" aria-hidden="true" /> : 
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        }
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Rester connecté pendant 30 jours
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  >
                    {isLoading || isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 mr-2" />
                        <span>Connexion sécurisée</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  En vous connectant, vous acceptez les <a href="#" className="text-orange-500 hover:underline">Conditions d'utilisation</a> et la <a href="#" className="text-orange-500 hover:underline">Politique de confidentialité</a>.
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer avec lien de retour */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 font-medium transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Retourner à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
