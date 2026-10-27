import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import KairouanLogo from '@/components/KairouanLogo';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await resetPassword(email);
    setLoading(false);
    if (ok) setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />
      <div className="pt-32 pb-20 max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <KairouanLogo size={48} variant="gold" showText={false} />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
          <p className="text-gray-500 mt-1 text-sm">Nous vous enverrons un lien de réinitialisation</p>
        </div>

        <div className="bg-white border border-black/10 p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h2 className="font-bold text-gray-900 mb-2">Email envoyé !</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
                Vérifiez aussi vos spams.
              </p>
              <Link to="/connexion"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Votre adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-black/15 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="votre@email.com" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Envoyer le lien
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <div className="text-center pt-2">
                <Link to="/connexion"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
