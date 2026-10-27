import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-gold-100">
      {/* CTA Section */}
      <div className="bg-arabesque relative">
        <div className="absolute inset-0 bg-forest-900/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="section-divider mb-4">❖ ✦ ❖</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-200 mb-4">
            Prêt à commencer votre parcours ?
          </h2>
          <p className="text-gold-300/80 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'étudiants qui ont choisi Kairouan Academy pour approfondir leurs connaissances islamiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogue" className="px-8 py-4 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold rounded-xl transition-colors shadow-lg shadow-gold-400/20">
              Explorer les cours
            </Link>
            <Link to="/connexion" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-gold-200 font-semibold rounded-xl transition-colors border border-gold-400/25">
              Créer un compte gratuit
            </Link>
          </div>
          <div className="section-divider mt-8">❖ ✦ ❖</div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-gold-400/40 flex items-center justify-center bg-forest-800">
                <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4 L22 10 L18 10 Z" fill="#C9A84C"/>
                  <rect x="17" y="10" width="6" height="4" rx="1" fill="#C9A84C"/>
                  <path d="M15 14 Q20 11 25 14 L26 22 L14 22 Z" fill="#C9A84C" fillOpacity="0.8"/>
                  <rect x="13" y="22" width="14" height="12" rx="1" fill="#C9A84C" fillOpacity="0.7"/>
                  <path d="M16 34 L24 34 L26 38 L14 38 Z" fill="#C9A84C" fillOpacity="0.6"/>
                  <circle cx="20" cy="7" r="1.5" fill="#e8c97a"/>
                </svg>
              </div>
              <div>
                <div className="font-display text-lg font-bold text-gold-300 leading-none tracking-wide">Kairouan</div>
                <div className="text-[10px] font-semibold tracking-[0.3em] text-gold-500/80 uppercase">Academy</div>
              </div>
            </div>
            <p className="text-gold-100/50 text-sm leading-relaxed mb-6">
              Plateforme d'apprentissage en ligne dédiée aux sciences islamiques, à la langue arabe et à la spiritualité. Une initiative de Kairouan Éditions.
            </p>
          </div>

          {/* Cours */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-6">Nos Cours</h3>
            <ul className="space-y-3">
              {[
                { to: '/catalogue', label: 'Sciences Islamiques' },
                { to: '/catalogue', label: 'Langue Arabe' },
                { to: '/catalogue', label: 'Coran & Tajwid' },
                { to: '/catalogue', label: 'Cours Populaires' },
                { to: '/catalogue', label: 'Tous les cours' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gold-100/50 hover:text-gold-300 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-6">Liens Utiles</h3>
            <ul className="space-y-3">
              {[
                { to: '/connexion', label: 'Connexion' },
                { to: '/dashboard', label: 'Espace Étudiant' },
                { to: '/contact', label: 'Contact' },
                { to: '/mentions-legales', label: 'Mentions Légales' },
                { to: '/confidentialite', label: 'Politique de Confidentialité' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gold-100/50 hover:text-gold-300 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-gold-100/50 text-sm">contact@kairouaneditions.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span className="text-gold-100/50 text-sm">Belgique</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gold-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gold-100/30 text-sm">
            &copy; {new Date().getFullYear()} Kairouan Academy. Tous droits réservés.
          </p>
          <p className="text-gold-500/50 text-xs tracking-wider">
            Une initiative de Kairouan Éditions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
