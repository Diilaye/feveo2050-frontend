import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

   
const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { name: 'À propos', href: '#' },
    { name: 'Programme', href: '#programme' },
    { name: 'Adhérer', href: '#adherer' },
    { name: 'Investir', href: '#investir' },
    { name: 'Support', href: '#' },
    { name: 'FAQ', href: '#' },
  ];

  const legalLinks = [
    { name: 'Conditions d\'utilisation', href: '#' },
    { name: 'Politique de confidentialité', href: '#' },
    { name: 'Mentions légales', href: '#' },
  ];

  return (
    <footer className="bg-neutral-900 text-neutral-50">
      <div className="container-max section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-neutral-50 font-bold text-xl">F</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">FEVEO</h3>
                <p className="text-accent-400 font-medium">2050</p>
              </div>
            </div>
            <p className="text-neutral-300 mb-6 leading-relaxed">
             Pour un investissement dans L’économie organique avec le Leadership féminin
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-neutral-800 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Liens rapides</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-neutral-300 hover:text-accent-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-accent-400 flex-shrink-0" />
                <span className="text-neutral-300">Dakar, Sénégal</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent-400 flex-shrink-0" />
                <span className="text-neutral-300">76 188 24 92 - 77 290 45 54 </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent-400 flex-shrink-0" />
                <span className="text-neutral-300">contact@feveo2050.sn</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Canal Officiel</h4>
            
            <div className="flex flex-col space-y-3">
             
              <button className="btn-accent">
                Acceder  à FEVEO 2050
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm">
              © 2024 FEVEO 2050. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-neutral-400 hover:text-accent-400 text-sm transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;