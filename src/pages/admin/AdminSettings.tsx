import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Save, Palette, Home, Mail, Globe, Shield, BookOpen, RefreshCw } from 'lucide-react';
import { DEFAULT_SETTINGS, SiteSettings, applySettingsToDOM, saveSettings, loadSettings } from '@/hooks/useSiteSettings';

const TABS = [
  { id: 'branding',  label: 'Apparence',   icon: Palette },
  { id: 'homepage',  label: 'Accueil',      icon: Home },
  { id: 'contact',   label: 'Contact',      icon: Mail },
  { id: 'footer',    label: 'Pied de page', icon: Globe },
  { id: 'platform',  label: 'Plateforme',   icon: BookOpen },
  { id: 'rights',    label: 'Droits',       icon: Shield },
] as const;

type TabId = typeof TABS[number]['id'];

const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gold-200 mb-1">{label}</label>
    {hint && <p className="text-xs text-gold-100/40 mb-1.5">{hint}</p>}
    {children}
  </div>
);

const inp = "w-full px-3 py-2.5 bg-forest-950 border border-gold-400/20 rounded-lg text-sm text-gold-100 placeholder-gold-100/30 focus:outline-none focus:ring-2 focus:ring-gold-400/40";
const ta  = inp + " resize-y font-mono";

const Toggle: React.FC<{ label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, hint, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div className="relative mt-0.5 flex-shrink-0">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
      <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-gold-400' : 'bg-forest-700'}`} />
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </div>
    <div>
      <p className="text-sm font-semibold text-gold-200">{label}</p>
      {hint && <p className="text-xs text-gold-100/40">{hint}</p>}
    </div>
  </label>
);

const AdminSettings: React.FC = () => {
  const [tab, setTab] = useState<TabId>('branding');
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings().then(s => { setForm(s); setLoading(false); });
  }, []);

  const set = (k: keyof SiteSettings, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await saveSettings(form);
    applySettingsToDOM(form);
    setSaving(false);
    toast({ title: 'Paramètres enregistrés', description: 'Les modifications sont en ligne.' });
  };

  const handleReset = () => {
    setForm(DEFAULT_SETTINGS);
    toast({ title: 'Réinitialisation', description: 'Paramètres par défaut restaurés. Cliquez sur Enregistrer pour appliquer.' });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-gold-400/25 border-t-gold-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gold-200">Paramètres de la plateforme</h1>
          <p className="text-sm text-gold-100/40 mt-0.5">Personnalisez textes, couleurs, droits et contenu</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gold-400/20 text-gold-100/50 text-sm rounded-lg hover:border-gold-400/40 hover:text-gold-200 transition-colors">
            <RefreshCw className="w-4 h-4" /> Réinitialiser
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-gold-400 text-forest-950 text-sm font-bold rounded-lg hover:bg-gold-300 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-forest-900 border border-gold-400/10 rounded-xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-gold-400/15 text-gold-300 border border-gold-400/30' : 'text-gold-100/50 hover:text-gold-200 hover:bg-forest-800'
            }`}>
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-forest-900 border border-gold-400/10 rounded-xl p-6 space-y-6">

        {/* ── APPARENCE ── */}
        {tab === 'branding' && (
          <>
            <h2 className="text-base font-bold text-gold-300 border-b border-gold-400/15 pb-2">Identité visuelle</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nom du site">
                <input value={form.site_name} onChange={e => set('site_name', e.target.value)} className={inp} />
              </Field>
              <Field label="Emoji favicon (onglet navigateur)">
                <input value={form.favicon_emoji} onChange={e => set('favicon_emoji', e.target.value)} className={inp} maxLength={4} />
              </Field>
            </div>

            <Field label="Accroche courte (sous le nom du site)" hint="Affiché dans le footer et les meta tags">
              <input value={form.site_tagline} onChange={e => set('site_tagline', e.target.value)} className={inp} />
            </Field>

            <Field label="URL du logo" hint="Laissez vide pour utiliser le logo texte par défaut">
              <input value={form.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="https://..." className={inp} />
              {form.logo_url && <img src={form.logo_url} alt="logo preview" className="mt-2 h-12 object-contain rounded" />}
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Couleur principale (or / accent)" hint="Boutons, liens actifs, badges">
                <div className="flex gap-3 items-center">
                  <input type="color" value={form.accent_color} onChange={e => set('accent_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gold-400/20 cursor-pointer bg-forest-950" />
                  <input value={form.accent_color} onChange={e => set('accent_color', e.target.value)} className={inp} placeholder="#b8892c" />
                </div>
                <div className="mt-2 h-6 rounded" style={{ backgroundColor: form.accent_color }} />
              </Field>

              <Field label="Couleur de fond (beige / pages claires)" hint="Fond des pages publiques">
                <div className="flex gap-3 items-center">
                  <input type="color" value={form.bg_color} onChange={e => set('bg_color', e.target.value)}
                    className="w-12 h-10 rounded border border-gold-400/20 cursor-pointer bg-forest-950" />
                  <input value={form.bg_color} onChange={e => set('bg_color', e.target.value)} className={inp} placeholder="#e8d9c0" />
                </div>
                <div className="mt-2 h-6 rounded" style={{ backgroundColor: form.bg_color }} />
              </Field>
            </div>

            <div className="bg-forest-950/50 border border-gold-400/10 rounded-lg p-3 text-xs text-gold-100/40">
              💡 Les couleurs sont appliquées instantanément après enregistrement. Rechargez la page publique pour voir le résultat.
            </div>
          </>
        )}

        {/* ── ACCUEIL ── */}
        {tab === 'homepage' && (
          <>
            <h2 className="text-base font-bold text-gold-300 border-b border-gold-400/15 pb-2">Page d'accueil — Hero</h2>

            <Field label="Titre principal du hero" hint="Utilisez \\n pour les sauts de ligne">
              <textarea value={form.hero_title} onChange={e => set('hero_title', e.target.value)} rows={3} className={ta} />
            </Field>
            <Field label="Sous-titre / description du hero">
              <textarea value={form.hero_subtitle} onChange={e => set('hero_subtitle', e.target.value)} rows={3} className={ta} />
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Citation arabe">
                <input value={form.arabic_quote} onChange={e => set('arabic_quote', e.target.value)} className={inp} dir="rtl" />
              </Field>
              <Field label="Traduction française">
                <input value={form.arabic_translation} onChange={e => set('arabic_translation', e.target.value)} className={inp} />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Bouton CTA principal — libellé">
                <input value={form.cta_primary_label} onChange={e => set('cta_primary_label', e.target.value)} className={inp} />
              </Field>
              <Field label="Bouton CTA principal — lien">
                <input value={form.cta_primary_link} onChange={e => set('cta_primary_link', e.target.value)} className={inp} placeholder="/catalogue" />
              </Field>
              <Field label="Bouton secondaire — libellé">
                <input value={form.cta_secondary_label} onChange={e => set('cta_secondary_label', e.target.value)} className={inp} />
              </Field>
              <Field label="Bouton secondaire — lien">
                <input value={form.cta_secondary_link} onChange={e => set('cta_secondary_link', e.target.value)} className={inp} placeholder="/connexion" />
              </Field>
            </div>

            <h2 className="text-base font-bold text-gold-300 border-b border-gold-400/15 pb-2 mt-4">Statistiques</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {([1,2,3,4] as const).map(n => (
                <div key={n} className="grid grid-cols-2 gap-2">
                  <Field label={`Stat ${n} — valeur`}>
                    <input value={(form as any)[`stat${n}_value`]} onChange={e => set(`stat${n}_value` as any, e.target.value)} className={inp} />
                  </Field>
                  <Field label="libellé">
                    <input value={(form as any)[`stat${n}_label`]} onChange={e => set(`stat${n}_label` as any, e.target.value)} className={inp} />
                  </Field>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── CONTACT ── */}
        {tab === 'contact' && (
          <>
            <h2 className="text-base font-bold text-gold-300 border-b border-gold-400/15 pb-2">Informations de contact</h2>

            <Field label="Adresse email" hint="Affichée sur la page Contact et dans le footer">
              <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} className={inp} />
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Lien WhatsApp" hint="Format: https://wa.me/32XXXXXXXXX">
                <input value={form.whatsapp_url} onChange={e => set('whatsapp_url', e.target.value)} className={inp} placeholder="https://wa.me/..." />
              </Field>
              <Field label="Texte affiché pour WhatsApp">
                <input value={form.whatsapp_display} onChange={e => set('whatsapp_display', e.target.value)} className={inp} />
              </Field>
            </div>

            <Field label="Délai de réponse affiché">
              <input value={form.response_time} onChange={e => set('response_time', e.target.value)} className={inp} />
            </Field>

            <h2 className="text-base font-bold text-gold-300 border-b border-gold-400/15 pb-2 mt-4">Mentions légales</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nom de la société">
                <input value={form.company_name} onChange={e => set('company_name', e.target.value)} className={inp} />
              </Field>
              <Field label="Pays">
                <input value={form.company_country} onChange={e => set('company_country', e.target.value)} className={inp} />
              </Field>
            </div>
          </>
        )}

        {/* ── FOOTER ── */}
        {tab === 'footer' && (
          <>
            <h2 className="text-base font-bold text-gold-300 border-b border-gold-400/15 pb-2">Pied de page</h2>

            <Field label="Description de la marque" hint="Texte sous le logo dans le footer">
              <textarea value={form.footer_description} onChange={e => set('footer_description', e.target.value)} rows={3} className={ta} />
            </Field>

            <Field label="Texte de copyright">
              <input value={form.footer_copyright} onChange={e => set('footer_copyright', e.target.value)} className={inp} />
            </Field>
          </>
        )}

        {/* ── PLATEFORME ── */}
        {tab === 'platform' && (
          <>
            <h2 className="text-base font-bold text-gold-300 border-b border-gold-400/15 pb-2">Paramètres de la plateforme LMS</h2>

            <Field label="Symbole monétaire" hint="Affiché à côté des prix">
              <input value={form.currency_symbol} onChange={e => set('currency_symbol', e.target.value)} className={inp} style={{ maxWidth: 100 }} />
            </Field>

            <Field label="Texte du bouton de complétion de leçon">
              <input value={form.lesson_completion_text} onChange={e => set('lesson_completion_text', e.target.value)} className={inp} />
            </Field>

            <div className="space-y-4 pt-2">
              <Toggle
                label="Activer les quiz"
                hint="Si désactivé, les quiz n'apparaissent pas dans l'interface étudiant"
                checked={form.enable_quiz}
                onChange={v => set('enable_quiz', v)}
              />
              <Toggle
                label="Activer les certificats"
                hint="Génération automatique de PDF à la fin d'un cours"
                checked={form.enable_certificates}
                onChange={v => set('enable_certificates', v)}
              />
            </div>
          </>
        )}

        {/* ── DROITS ── */}
        {tab === 'rights' && (
          <>
            <h2 className="text-base font-bold text-gold-300 border-b border-gold-400/15 pb-2">Gestion des accès</h2>

            <div className="space-y-5">
              <Toggle
                label="Confirmer l'email à l'inscription"
                hint="L'étudiant doit cliquer sur un lien dans sa boîte mail avant de pouvoir se connecter. Doit aussi être activé dans Supabase Authentication > Settings."
                checked={form.require_email_confirmation}
                onChange={v => set('require_email_confirmation', v)}
              />
              <Toggle
                label="Autoriser l'auto-inscription"
                hint="Si désactivé, seuls les comptes créés manuellement par un admin peuvent se connecter"
                checked={form.allow_self_registration}
                onChange={v => set('allow_self_registration', v)}
              />
            </div>

            <Field label="Rôle par défaut des nouveaux inscrits" hint="student = accès cours uniquement · collaborator = accès admin cours">
              <select value={form.default_role} onChange={e => set('default_role', e.target.value)}
                className={inp}>
                <option value="student">student — Étudiant</option>
                <option value="collaborator">collaborator — Collaborateur</option>
              </select>
            </Field>

            <div className="bg-amber-950/30 border border-amber-600/20 rounded-lg p-4 space-y-2 text-sm text-amber-200/70">
              <p className="font-semibold text-amber-300">Rôles disponibles</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li><strong className="text-amber-200">student</strong> — accès aux cours achetés, dashboard personnel</li>
                <li><strong className="text-amber-200">collaborator</strong> — accès à l'admin : créer/modifier des cours</li>
                <li><strong className="text-amber-200">admin</strong> — accès complet : cours, étudiants, commandes, coupons, paramètres</li>
              </ul>
              <p className="text-xs text-amber-200/50 mt-2">Modifiez les rôles individuellement dans Admin → Comptes.</p>
            </div>
          </>
        )}
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gold-400 text-forest-950 font-bold rounded-xl shadow-2xl shadow-gold-400/30 hover:bg-gold-300 transition-colors disabled:opacity-50 text-sm">
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
