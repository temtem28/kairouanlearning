import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Plus, Tag, Trash2, ToggleLeft, ToggleRight, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: '', percent_off: '', amount_off: '', active: true, expires_at: '',
  });

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ecom_coupons')
      .select('*')
      .order('created_at', { ascending: false });
    setCoupons(data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.code) {
      toast({ title: 'Code requis', variant: 'destructive' });
      return;
    }
    if (!form.percent_off && !form.amount_off) {
      toast({ title: 'Réduction requise', description: 'Renseignez un % ou un montant.', variant: 'destructive' });
      return;
    }
    setCreating(true);
    const { error } = await supabase.from('ecom_coupons').insert({
      code: form.code.toUpperCase().trim(),
      percent_off: form.percent_off ? parseInt(form.percent_off) : null,
      amount_off: form.amount_off ? Math.round(parseFloat(form.amount_off) * 100) : null,
      active: form.active,
      expires_at: form.expires_at || null,
    });
    setCreating(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Coupon créé' });
      setShowCreate(false);
      setForm({ code: '', percent_off: '', amount_off: '', active: true, expires_at: '' });
      fetchCoupons();
    }
  };

  const handleToggle = async (coupon: any) => {
    await supabase.from('ecom_coupons').update({ active: !coupon.active }).eq('id', coupon.id);
    setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, active: !c.active } : c));
    toast({ title: coupon.active ? 'Coupon désactivé' : 'Coupon activé' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('ecom_coupons').delete().eq('id', deleteId);
    setCoupons(prev => prev.filter(c => c.id !== deleteId));
    toast({ title: 'Coupon supprimé' });
    setDeleteId(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: `"${code}" copié` });
  };

  const isExpired = (c: any) => c.expires_at && new Date(c.expires_at) <= new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">{coupons.length} code{coupons.length !== 1 ? 's' : ''} promo</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouveau coupon
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />)}</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucun coupon pour le moment</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Code</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Réduction</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 font-medium text-gray-500">Expiration</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map(c => {
                const expired = isExpired(c);
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {c.code}
                        </code>
                        <button onClick={() => copyCode(c.code)} className="text-gray-400 hover:text-gray-600">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {c.percent_off ? `${c.percent_off}%` : c.amount_off ? `${(c.amount_off / 100).toFixed(2)} €` : '—'}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-gray-500">
                      {c.expires_at ? (
                        <span className={expired ? 'text-red-500' : ''}>
                          {new Date(c.expires_at).toLocaleDateString('fr-FR')}
                          {expired && ' (expiré)'}
                        </span>
                      ) : 'Sans limite'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        c.active && !expired
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {c.active && !expired ? 'Actif' : expired ? 'Expiré' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(c)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title={c.active ? 'Désactiver' : 'Activer'}
                        >
                          {c.active
                            ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                            : <ToggleLeft className="w-5 h-5" />
                          }
                        </button>
                        <button
                          onClick={() => setDeleteId(c.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nouveau coupon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="PROMO20"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Réduction (%)</label>
                <input
                  type="number" min={0} max={100}
                  value={form.percent_off}
                  onChange={e => setForm(p => ({ ...p, percent_off: e.target.value, amount_off: '' }))}
                  placeholder="20"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                <input
                  type="number" min={0} step={0.01}
                  value={form.amount_off}
                  onChange={e => setForm(p => ({ ...p, amount_off: e.target.value, percent_off: '' }))}
                  placeholder="10.00"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration (optionnel)</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
                className="accent-emerald-600"
              />
              <span className="text-sm text-gray-700">Activer immédiatement</span>
            </label>
          </div>
          <DialogFooter>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600">Annuler</button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {creating ? 'Création...' : 'Créer'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce coupon ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCoupons;
