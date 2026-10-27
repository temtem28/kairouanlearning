import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Mail, MessageCircle, Send, CheckCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email.toLowerCase(),
      subject: form.subject || null,
      message: form.message,
      created_at: new Date().toISOString(),
    });
    setLoading(false);
    if (dbError) console.error('Contact save error:', dbError.message);
    setSent(true);
  };

  const inputCls = "w-full px-4 py-3 bg-white border border-black/15 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20";

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />

      {/* Hero */}
      <section className="bg-black pt-16 lg:pt-18">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-gold-400/60 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Kairouan Academy</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Contactez-nous</h1>
          <p className="text-white/40 mt-2 text-sm">Une question ? Nous vous répondrons dans les meilleurs délais.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Info */}
            <div className="space-y-4">
              <div className="bg-white border border-black/8 p-6">
                <div className="w-9 h-9 bg-black flex items-center justify-center mb-4">
                  <Mail className="w-4 h-4 text-gold-400" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Email</h3>
                <a href="mailto:kairouan.editions@gmail.com" className="text-sm text-gray-500 hover:text-black transition-colors">
                  kairouan.editions@gmail.com
                </a>
              </div>
              <div className="bg-white border border-black/8 p-6">
                <div className="w-9 h-9 bg-black flex items-center justify-center mb-4">
                  <MessageCircle className="w-4 h-4 text-gold-400" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">WhatsApp</h3>
                <a
                  href="https://wa.me/message/VOTRE_LIEN_WHATSAPP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Nous contacter sur WhatsApp
                </a>
              </div>
              <div className="bg-white border border-black/8 p-6">
                <h3 className="font-bold text-gray-900 text-sm mb-2">Délai de réponse</h3>
                <p className="text-sm text-gray-500">Nous répondons généralement sous 24 à 48 heures ouvrées.</p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              {sent ? (
                <div className="bg-white border border-black/8 p-12 text-center">
                  <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
                  <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Message envoyé !</h2>
                  <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                    Merci pour votre message.<br />Nous vous répondrons dans les plus brefs délais à l'adresse <strong>{form.email}</strong>.
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors">
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-black/8 p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Nom *</label>
                      <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        className={inputCls} placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        className={inputCls} placeholder="votre@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Sujet</label>
                    <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                      className={inputCls} placeholder="Sujet de votre message" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Message *</label>
                    <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={6}
                      className={inputCls + ' resize-none'} placeholder="Votre message..." />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2">{error}</p>
                  )}
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <><Send className="w-4 h-4" /> Envoyer le message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
