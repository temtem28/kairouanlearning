import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import KairouanLogo from '@/components/KairouanLogo';
import { Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isRegister) {
      const success = await register(name, email, password);
      setLoading(false);
      if (success) setRegistered(true);
    } else {
      const role = await login(email, password);
      setLoading(false);
      if (role) {
        if (role === 'admin' || role === 'collaborator') navigate('/admin');
        else navigate('/dashboard');
      }
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-white border border-black/15 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30";

  if (registered) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
        <Header />
        <div className="pt-32 pb-20 max-w-md mx-auto px-4">
          <div className="bg-white border border-black/10 p-10 text-center">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">Compte créé !</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Un email de confirmation a été envoyé à <strong>{email}</strong>.<br />
              Vérifiez votre boîte mail puis connectez-vous.
            </p>
            <button onClick={() => { setRegistered(false); setIsRegister(false); }}
              className="w-full py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />
      <div className="pt-32 pb-20 max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <KairouanLogo size={48} variant="gold" showText={false} />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {isRegister ? 'Créer un compte' : 'Connexion'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isRegister ? 'Rejoignez Kairouan Academy' : 'Accédez à votre espace étudiant'}
          </p>
        </div>

        <div className="bg-white border border-black/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    className={inputClass} placeholder="Votre nom complet" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className={inputClass} placeholder="votre@email.com" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Mot de passe</label>
                {!isRegister && (
                  <Link to="/mot-de-passe-oublie" className="text-xs text-gray-500 hover:text-black transition-colors">
                    Mot de passe oublié ?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  minLength={6} className={inputClass} placeholder="••••••••" />
              </div>
              {isRegister && <p className="text-xs text-gray-400 mt-1">Minimum 6 caractères</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {isRegister ? "S'inscrire" : 'Se connecter'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-black/8 text-center">
            <button onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-gray-600 hover:text-black transition-colors font-medium">
              {isRegister ? 'Déjà un compte ? Se connecter' : "Pas encore de compte ? S'inscrire"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
