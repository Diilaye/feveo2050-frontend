import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';

const Header = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('fr');

  const navigation = [
    { name: 'Accueil', href: '#accueil', action: () => onNavigate('home') },
    { name: 'Programme', href: '#programme' },
    { name: 'Adhérer', href: '#adherer' },
    { name: 'Investir', href: '#investir' },
    { name: 'Wallet GIE', href: '#wallet', action: () => onNavigate('dashboard') },
    { name: 'Galerie', href: '#galerie' },
  ];

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="container-max section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-neutral-50 font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">FEVEO</h1>
              <p className="text-xs text-accent-500 font-medium">2050</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className="text-neutral-600 hover:text-accent-500 font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Language & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === 'fr' ? 'wo' : 'fr')}
              className="flex items-center space-x-1 text-neutral-600 hover:text-accent-500 transition-colors duration-200"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'fr' ? 'FR' : 'WO'}</span>
            </button>
            <button className="btn-accent">
              Commencer
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 hover:text-accent-500 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="text-neutral-600 hover:text-accent-500 font-medium py-2 transition-colors duration-200 text-left"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <button
                  onClick={() => setLanguage(language === 'fr' ? 'wo' : 'fr')}
                  className="flex items-center space-x-1 text-neutral-600 hover:text-accent-500 transition-colors duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{language === 'fr' ? 'FR' : 'WO'}</span>
                </button>
                <button className="btn-accent">
                  Commencer
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;