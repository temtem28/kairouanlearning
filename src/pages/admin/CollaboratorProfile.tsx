import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { UserCircle, Save, Loader2 } from 'lucide-react';

const CollaboratorProfile: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', photo_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.email) return;
      const { data } = await supabase
        .from('ecom_customers')
        .select('name, bio, photo_url')
        .eq('email', user.email)
        .single();
      if (data) {
        setForm({
          name: data.name || '',
          bio: (data as any).bio || '',
          photo_url: (data as any).photo_url || '',
        });
      }
      setLoading(false);
    };
    load();
  }, [user?.email]);

  const handleSave = async () => {
    if (!user?.email) return;
    setSaving(true);
    const { error } = await supabase
      .from('ecom_customers')
      .update({ name: form.name, bio: form.bio, photo_url: form.photo_url })
      .eq('email', user.email);
    setSaving(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profil mis à jour', description: 'Vos informations ont été enregistrées.' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-forest-900 rounded-xl p-5 h-16 border border-gold-400/10" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-gold-200">Mon profil</h1>
        <p className="text-gold-100/40 text-sm mt-1">Votre présentation visible par les étudiants.</p>
      </div>

      {/* Photo preview */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-forest-800 border-2 border-gold-400/25 flex-shrink-0 flex items-center justify-center">
          {form.photo_url ? (
            <img src={form.photo_url} alt="Photo" className="w-full h-full object-cover" />
          ) : (
            <UserCircle className="w-10 h-10 text-gold-400/40" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-gold-100/60 mb-1.5">URL de la photo de profil</label>
          <input
            type="url"
            value={form.photo_url}
            onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))}
            placeholder="https://…"
            className="w-full px-3 py-2.5 bg-forest-900 border border-gold-400/15 rounded-lg text-sm text-gold-200 placeholder:text-gold-100/25 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
          />
        </div>
      </div>

      <div className="bg-forest-900 rounded-xl border border-gold-400/12 p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Nom affiché *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Ustadh Prénom Nom"
            className="w-full px-3 py-2.5 bg-forest-950 border border-gold-400/15 rounded-lg text-sm text-gold-200 placeholder:text-gold-100/25 focus:outline-none focus:ring-2 focus:ring-gold-400/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Biographie / Présentation</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            rows={5}
            placeholder="Décrivez votre parcours académique, vos spécialités, votre isnâd…"
            className="w-full px-3 py-2.5 bg-forest-950 border border-gold-400/15 rounded-lg text-sm text-gold-200 placeholder:text-gold-100/25 focus:outline-none focus:ring-2 focus:ring-gold-400/30 resize-none leading-relaxed"
          />
          <p className="text-xs text-gold-100/25 mt-1">{form.bio.length} caractères</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !form.name.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold rounded-xl transition-colors text-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <span className="text-xs text-gold-100/30">{user?.email}</span>
      </div>
    </div>
  );
};

export default CollaboratorProfile;
