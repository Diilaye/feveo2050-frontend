import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

const Header = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProgramsDropdownOpen, setIsProgramsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState('fr');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProgramsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Accueil', href: '#accueil', action: () => onNavigate('home') },
    { 
      name: 'Programmes', 
      href: '#programme',
      hasDropdown: true,
      submenu: [
        { name: 'Initiative globale Nexus', action: () => onNavigate('about') },
        { name: 'Présentation projet AEROBUS', action: () => console.log('AEROBUS presentation') },
        { name: 'Adhérer AVEC FEVEO', action: () => onNavigate('adhesion') },
        { name: 'Souscrire actions AEROBUS', action: () => console.log('AEROBUS subscription') }
      ]
    },
    { name: 'Adhérer', href: '#adherer', action: () => onNavigate('adhesion') },
    { name: 'Investir', href: '#investir' , action: () => onNavigate('investir')  },
    { name: 'Wallet GIE', href: '#wallet', action: () => onNavigate('dashboard') },
  ];

  const handleNavClick = (item) => {
    if (item.hasDropdown) {
      setIsProgramsDropdownOpen(!isProgramsDropdownOpen);
    } else if (item.action) {
      item.action();
      setIsMenuOpen(false);
      setIsProgramsDropdownOpen(false);
    }
  };

  const handleSubmenuClick = (submenuItem) => {
    if (submenuItem.action) {
      submenuItem.action();
    }
    setIsMenuOpen(false);
    setIsProgramsDropdownOpen(false);
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
              <div key={item.name} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
                <button
                  onClick={() => handleNavClick(item)}
                  className="flex items-center gap-1 text-neutral-600 hover:text-accent-500 font-medium transition-colors duration-200"
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProgramsDropdownOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {item.hasDropdown && isProgramsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                    {item.submenu?.map((submenuItem, index) => (
                      <button
                        key={index}
                        onClick={() => handleSubmenuClick(submenuItem)}
                        className="w-full text-left px-4 py-2 text-neutral-600 hover:text-accent-500 hover:bg-accent-50 transition-colors duration-200"
                      >
                        {submenuItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                <div key={item.name}>
                  <button
                    onClick={() => handleNavClick(item)}
                    className="flex items-center justify-between w-full text-neutral-600 hover:text-accent-500 font-medium py-2 transition-colors duration-200 text-left"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProgramsDropdownOpen ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  
                  {/* Mobile Submenu */}
                  {item.hasDropdown && isProgramsDropdownOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.submenu?.map((submenuItem, index) => (
                        <button
                          key={index}
                          onClick={() => handleSubmenuClick(submenuItem)}
                          className="block w-full text-left text-neutral-500 hover:text-accent-500 py-1 text-sm transition-colors duration-200"
                        >
                          • {submenuItem.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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