import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import {
  Search, Plus, Trash2, Shield, User, Users, UserCheck, Loader2,
  BookOpen, TrendingUp, X, ChevronRight, Eye,
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';

const ROLES = [
  { value: 'student',      label: 'Étudiant',      icon: User,      color: 'bg-blue-400/10 text-blue-300 border-blue-400/20' },
  { value: 'collaborator', label: 'Collaborateur',  icon: UserCheck, color: 'bg-gold-400/10 text-gold-300 border-gold-400/20' },
  { value: 'admin',        label: 'Administrateur', icon: Shield,    color: 'bg-red-400/10 text-red-300 border-red-400/20' },
];

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const r = ROLES.find(x => x.value === role) || ROLES[0];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${r.color}`}>
      <r.icon className="w-3 h-3" />
      {r.label}
    </span>
  );
};

/* ── Panneau de monitoring d'un collaborateur ── */
const CollaboratorPanel: React.FC<{ collab: any; onClose: () => void }> = ({ collab, onClose }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: products } = await supabase
        .from('ecom_products')
        .select('id, name, price, handle')
        .filter('metadata->>instructor', 'eq', collab.name)
        .order('created_at', { ascending: false });

      if (!products?.length) { setCourses([]); setLoading(false); return; }

      const ids = products.map(p => p.id);
      const { data: enrollments } = await supabase
        .from('lms_enrollments')
        .select('product_id')
        .in('product_id', ids)
        .eq('status', 'active');

      const countMap: Record<string, number> = {};
      (enrollments || []).forEach(e => {
        countMap[e.product_id] = (countMap[e.product_id] || 0) + 1;
      });

      setCourses(products.map(p => ({
        ...p,
        enrollments: countMap[p.id] || 0,
        revenue: ((countMap[p.id] || 0) * (p.price || 0)) / 100,
      })));
      setLoading(false);
    };
    load();
  }, [collab]);

  const totalEnrollments = courses.reduce((s, c) => s + c.enrollments, 0);
  const totalRevenue = courses.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-forest-950/70" onClick={onClose} />
      <div className="relative w-full max-w-md bg-forest-900 border-l border-gold-400/15 h-full overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold-400/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-400/10 border border-gold-400/25 rounded-full flex items-center justify-center text-gold-300 font-bold text-lg">
              {collab.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gold-200">{collab.name}</p>
              <p className="text-xs text-gold-100/40">{collab.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-forest-800 text-gold-100/40 hover:text-gold-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 px-6 py-4 border-b border-gold-400/10">
          <div className="bg-forest-800/60 rounded-xl p-4 border border-gold-400/10">
            <BookOpen className="w-4 h-4 text-gold-400 mb-2" />
            <div className="text-2xl font-bold text-gold-200">{courses.length}</div>
            <div className="text-xs text-gold-100/40 mt-0.5">Cours publiés</div>
          </div>
          <div className="bg-forest-800/60 rounded-xl p-4 border border-gold-400/10">
            <Users className="w-4 h-4 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-blue-300">{totalEnrollments}</div>
            <div className="text-xs text-gold-100/40 mt-0.5">Inscriptions totales</div>
          </div>
          <div className="col-span-2 bg-forest-800/60 rounded-xl p-4 border border-gold-400/10">
            <TrendingUp className="w-4 h-4 text-emerald-400 mb-2" />
            <div className="text-2xl font-bold text-emerald-300">{totalRevenue.toFixed(2)} €</div>
            <div className="text-xs text-gold-100/40 mt-0.5">Revenu généré (prix catalogue)</div>
          </div>
        </div>

        {/* Courses list */}
        <div className="flex-1 px-6 py-4">
          <p className="text-xs font-semibold text-gold-100/50 uppercase tracking-widest mb-3">Ses cours</p>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-forest-800/40 rounded-xl h-16 animate-pulse border border-gold-400/10" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gold-400/15 rounded-xl">
              <BookOpen className="w-8 h-8 text-gold-100/20 mx-auto mb-2" />
              <p className="text-gold-100/40 text-sm">Aucun cours assigné</p>
              <p className="text-gold-100/25 text-xs mt-1">
                Le nom du collaborateur doit correspondre au champ "instructeur" du cours
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {courses.map(course => (
                <a
                  key={course.id}
                  href={`/cours/${course.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-forest-800/40 rounded-xl border border-gold-400/10 hover:border-gold-400/25 hover:bg-forest-800/60 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gold-200 truncate group-hover:text-gold-100">{course.name}</p>
                    <p className="text-xs text-gold-100/40 mt-0.5">
                      {course.price ? `${(course.price / 100).toFixed(2)} €` : 'Gratuit'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-300">{course.enrollments}</p>
                      <p className="text-xs text-gold-100/30">inscrits</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gold-100/25 group-hover:text-gold-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Page principale ── */
const AdminUsers: React.FC = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteEmail, setDeleteEmail] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'collaborator' });
  const [selectedCollab, setSelectedCollab] = useState<any | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ecom_customers')
      .select('*')
      .order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (email: string, newRole: string) => {
    if (email === me?.email && newRole !== 'admin') {
      toast({ title: 'Action refusée', description: 'Vous ne pouvez pas retirer vos propres droits admin.', variant: 'destructive' });
      return;
    }
    setUpdatingId(email);
    const { error } = await supabase
      .from('ecom_customers')
      .update({ role: newRole })
      .eq('email', email);
    setUpdatingId(null);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setUsers(prev => prev.map(u => u.email === email ? { ...u, role: newRole } : u));
      toast({ title: 'Rôle mis à jour' });
    }
  };

  const handleDelete = async () => {
    if (!deleteEmail) return;
    if (deleteEmail === me?.email) {
      toast({ title: 'Action refusée', description: 'Impossible de supprimer votre propre compte.', variant: 'destructive' });
      setDeleteEmail(null);
      return;
    }
    const { error } = await supabase.from('ecom_customers').delete().eq('email', deleteEmail);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setUsers(prev => prev.filter(u => u.email !== deleteEmail));
      toast({ title: 'Compte supprimé' });
    }
    setDeleteEmail(null);
  };

  const handleCreate = async () => {
    if (!newUser.name || !newUser.email) {
      toast({ title: 'Champs requis', description: 'Nom et email obligatoires.', variant: 'destructive' });
      return;
    }
    setCreating(true);
    const { error } = await supabase
      .from('ecom_customers')
      .upsert({ email: newUser.email.toLowerCase(), name: newUser.name, role: newUser.role }, { onConflict: 'email' });
    setCreating(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Compte créé', description: `${newUser.name} peut maintenant se connecter.` });
      setShowCreate(false);
      setNewUser({ name: '', email: '', role: 'collaborator' });
      fetchUsers();
    }
  };

  const counts = {
    total: users.length,
    students: users.filter(u => !u.role || u.role === 'student').length,
    collaborators: users.filter(u => u.role === 'collaborator').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || (u.role || 'student') === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gold-200">Gestion des comptes</h1>
          <p className="text-gold-100/50 text-sm mt-1">
            {counts.total} comptes — {counts.students} étudiants · {counts.collaborators} collaborateurs · {counts.admins} admins
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="sm:ml-auto flex items-center gap-2 px-4 py-2.5 bg-gold-400 text-forest-950 rounded-xl text-sm font-medium hover:bg-gold-300 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouveau collaborateur
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Étudiants',      value: counts.students,      color: 'text-blue-300',   bg: 'bg-blue-400/8 border-blue-400/15',   icon: User },
          { label: 'Collaborateurs', value: counts.collaborators, color: 'text-gold-300',   bg: 'bg-gold-400/8 border-gold-400/15',   icon: UserCheck },
          { label: 'Admins',         value: counts.admins,        color: 'text-red-300',    bg: 'bg-red-400/8  border-red-400/15',    icon: Shield },
        ].map((k, i) => (
          <div key={i} className={`rounded-xl p-4 border ${k.bg}`}>
            <k.icon className={`w-4 h-4 ${k.color} mb-2`} />
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-xs text-gold-100/40 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-100/40" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gold-400/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40 bg-forest-900 text-gold-200 placeholder:text-gold-100/30"
          />
        </div>
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="px-4 py-2.5 border border-gold-400/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40 bg-forest-900 text-gold-200"
        >
          <option value="">Tous les rôles</option>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-forest-900 rounded-xl h-16 animate-pulse border border-gold-400/10" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-forest-900 rounded-2xl border border-dashed border-gold-400/15">
          <Users className="w-10 h-10 text-gold-100/30 mx-auto mb-3" />
          <p className="text-gold-100/50 text-sm">Aucun compte trouvé</p>
        </div>
      ) : (
        <div className="bg-forest-900 rounded-xl border border-gold-400/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest-800/40 border-b border-gold-400/10">
                <th className="text-left px-4 py-3 font-medium text-gold-100/50">Compte</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 font-medium text-gold-100/50">Inscription</th>
                <th className="text-left px-4 py-3 font-medium text-gold-100/50">Rôle</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/8">
              {filtered.map(u => (
                <tr key={u.email} className="hover:bg-forest-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gold-400/10 border border-gold-400/20 rounded-full flex items-center justify-center text-gold-300 text-sm font-bold flex-shrink-0">
                        {(u.name || u.email)?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gold-200 truncate max-w-[180px]">{u.name || '—'}</p>
                        <p className="text-xs text-gold-100/40 truncate">{u.email}</p>
                      </div>
                      {u.email === me?.email && (
                        <span className="text-xs text-gold-400/50 border border-gold-400/20 px-1.5 py-0.5 rounded">vous</span>
                      )}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gold-100/40 text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <RoleBadge role={u.role || 'student'} />
                      {updatingId === u.email && <Loader2 className="w-3 h-3 animate-spin text-gold-400" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {(u.role === 'collaborator' || u.role === 'admin') && (
                        <button
                          onClick={() => setSelectedCollab(u)}
                          className="p-1.5 rounded-lg hover:bg-gold-400/10 text-gold-100/30 hover:text-gold-400 transition-colors"
                          title="Voir l'activité"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <select
                        value={u.role || 'student'}
                        onChange={e => handleRoleChange(u.email, e.target.value)}
                        disabled={updatingId === u.email}
                        className="text-xs px-2 py-1 bg-forest-800 border border-gold-400/15 rounded-lg text-gold-200 focus:outline-none focus:ring-1 focus:ring-gold-400/30 disabled:opacity-40"
                      >
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                      {u.email !== me?.email && (
                        <button
                          onClick={() => setDeleteEmail(u.email)}
                          className="p-1.5 rounded-lg hover:bg-red-950/40 text-gold-100/30 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Collaborator monitoring panel */}
      {selectedCollab && (
        <CollaboratorPanel collab={selectedCollab} onClose={() => setSelectedCollab(null)} />
      )}

      {/* Create Dialog — default role: collaborator */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Nouveau collaborateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Nom complet *</label>
              <input type="text" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                placeholder="Prénom Nom" className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30 bg-forest-900 text-gold-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Email *</label>
              <input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                placeholder="email@exemple.com" className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30 bg-forest-900 text-gold-200" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Rôle</label>
              <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30 bg-forest-900 text-gold-200">
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gold-100/50 hover:text-gold-200">Annuler</button>
            <button onClick={handleCreate} disabled={creating}
              className="px-4 py-2 bg-gold-400 text-forest-950 rounded-lg text-sm font-medium hover:bg-gold-300 transition-colors disabled:opacity-50 flex items-center gap-2">
              {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {creating ? 'Création…' : 'Créer le compte'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteEmail} onOpenChange={() => setDeleteEmail(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce compte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte <strong>{deleteEmail}</strong> sera supprimé définitivement.
            </AlertDialogDescription>
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

export default AdminUsers;
