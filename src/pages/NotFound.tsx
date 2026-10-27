import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const NotFound: React.FC = () => (
  <div className="min-h-screen bg-forest-950 text-gold-100">
    <Header />
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
      <h1 className="text-6xl font-serif font-bold text-gold-400">404</h1>
      <p className="text-xl text-gold-100/70">Page introuvable</p>
      <Link to="/" className="px-6 py-3 bg-gold-400 text-forest-950 rounded-lg font-semibold hover:bg-gold-300 transition-colors">
        Retour à l'accueil
      </Link>
    </div>
  </div>
);

export default NotFound;
