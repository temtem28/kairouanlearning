import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import KairouanLogo from '@/components/KairouanLogo';
import { Lock, ArrowRight } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true);
    const ok = await updatePassword(password);
    setLoading(false);
    if (ok) navigate('/dashboard');
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-white border border-black/15 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20";

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />
      <div className="pt-32 pb-20 max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <KairouanLogo size={48} variant="gold" showText={false} />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
          <p className="text-gray-500 mt-1 text-sm">Choisissez un nouveau mot de passe sécurisé</p>
        </div>

        <div className="bg-white border border-black/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nouveau mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  minLength={6} className={inputClass} placeholder="••••••••" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                  className={inputClass} placeholder="••••••••" />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2">{error}</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Enregistrer le mot de passe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
81

<system-reminder>
<total_tokens>14906258 tokens left</total_tokens>
</system-reminder>