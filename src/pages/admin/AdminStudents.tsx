import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Search, Users, CheckCircle, Clock, Filter, Plus, Loader2, UserCheck, BookOpen, Mail, Copy, Ban, Trash2, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Isolated client — signUp without affecting the admin session
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nvubddzcjjlcuwqhltsd.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dWJkZHpjampsY3V3cWhsdHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTk3NzYsImV4cCI6MjA5NjIzNTc3Nn0.yjldyaHjWuM2LGvI-2RUVQrs87J0ZmwqmOEYBixp92U';
const supabaseIsolated = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, storageKey: 'admin-student-create' },
});

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [revokeId, setRevokeId] = useState<string | null>(null);

  // Create student
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' });

  // Welcome email copy modal
  const [welcomeEmail, setWelcomeEmail] = useState<{ email: string; password: string; name: string } | null>(null);

  // Enroll student
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState<{ email: string; name: string } | null>(null);
  const [enrollForm, setEnrollForm] = useState({ product_id: '', access_expires_at: '' });
  const [enrolling, setEnrolling] = useState(false);

  // Suspend / delete
  const [suspendTarget, setSuspendTarget] = useState<{ email: string; name: string; suspended: boolean } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; email: string; name: string } | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: s }, { data: enr }, { data: c }] = await Promise.all([
      supabase.from('ecom_customers').select('id, name, email, created_at, status').eq('role', 'student').order('created_at', { ascending: false }),
      supabase.from('lms_enrollments').select('*, customer:ecom_customers(name, email), product:ecom_products(name, handle)').order('created_at', { ascending: false }),
      supabase.from('ecom_products').select('id, name').order('name'),
    ]);
    setStudents(s || []);
    setEnrollments(enr || []);
    setCourses(c || []);
    setLoading(false);
  };

  const handleRevoke = async () => {
    if (!revokeId) return;
    const { error } = await supabase.from('lms_enrollments').update({ status: 'revoked' }).eq('id', revokeId);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setEnrollments(prev => prev.map(e => e.id === revokeId ? { ...e, status: 'revoked' } : e));
      toast({ title: 'Accès révoqué' });
    }
    setRevokeId(null);
  };

  const handleRestore = async (id: string) => {
    await supabase.from('lms_enrollments').update({ status: 'active' }).eq('id', id);
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: 'active' } : e));
    toast({ title: 'Accès restauré' });
  };

  const handleCreateStudent = async () => {
    if (!newStudent.name || !newStudent.email) {
      toast({ title: 'Champs requis', description: 'Nom et email obligatoires.', variant: 'destructive' });
      return;
    }
    if (newStudent.password && newStudent.password.length < 6) {
      toast({ title: 'Mot de passe trop court', description: 'Minimum 6 caractères.', variant: 'destructive' });
      return;
    }
    setCreating(true);
    const email = newStudent.email.toLowerCase();

    const { error: dbError } = await supabase
      .from('ecom_customers')
      .upsert({ email, name: newStudent.name, role: 'student', status: 'active' }, { onConflict: 'email' });

    if (dbError) {
      setCreating(false);
      toast({ title: 'Erreur base de données', description: dbError.message, variant: 'destructive' });
      return;
    }

    if (newStudent.password) {
      const { error: signUpError } = await supabaseIsolated.auth.signUp({
        email,
        password: newStudent.password,
        options: { data: { full_name: newStudent.name } },
      });
      setCreating(false);
      if (signUpError && !signUpError.message.includes('already registered')) {
        toast({ title: 'Erreur création compte', description: signUpError.message, variant: 'destructive' });
      } else {
        setWelcomeEmail({ email, password: newStudent.password, name: newStudent.name });
      }
    } else {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      setCreating(false);
      if (otpError) {
        toast({ title: 'Compte créé, lien non envoyé', description: otpError.message, variant: 'destructive' });
      } else {
        toast({ title: 'Compte créé ✓', description: `Un lien de connexion a été envoyé à ${email}.` });
      }
    }

    setShowCreate(false);
    setNewStudent({ name: '', email: '', password: '' });
    fetchData();
  };

  const handleResendLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Lien renvoyé ✓', description: `Un nouveau lien de connexion a été envoyé à ${email}.` });
    }
  };

  const openEnrollDialog = (email: string, name: string) => {
    setEnrollTarget({ email, name });
    setEnrollForm({ product_id: '', access_expires_at: '' });
    setShowEnroll(true);
  };

  const handleEnroll = async () => {
    if (!enrollTarget || !enrollForm.product_id) {
      toast({ title: 'Cours requis', description: 'Sélectionnez un cours.', variant: 'destructive' });
      return;
    }
    setEnrolling(true);
    const { error } = await supabase.from('lms_enrollments').insert({
      user_email: enrollTarget.email,
      product_id: enrollForm.product_id,
      status: 'active',
      access_expires_at: enrollForm.access_expires_at || null,
    });
    setEnrolling(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Étudiant inscrit ✓', description: `${enrollTarget.name} a maintenant accès au cours.` });
      setShowEnroll(false);
      fetchData();
    }
  };

  const handleSuspend = async () => {
    if (!suspendTarget) return;
    const newStatus = suspendTarget.suspended ? 'active' : 'suspended';
    // Update ecom_customers status
    await supabase.from('ecom_customers').update({ status: newStatus }).eq('email', suspendTarget.email);
    // Also revoke/restore all enrollments
    const emailEnrollments = enrollments.filter(e => (e.customer?.email || e.user_email) === suspendTarget.email);
    for (const e of emailEnrollments) {
      await supabase.from('lms_enrollments').update({ status: newStatus === 'suspended' ? 'revoked' : 'active' }).eq('id', e.id);
    }
    toast({ title: newStatus === 'suspended' ? 'Compte suspendu' : 'Compte réactivé' });
    setSuspendTarget(null);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('ecom_customers').delete().eq('id', deleteTarget.id);
    toast({ title: 'Compte supprimé', description: `${deleteTarget.name} a été supprimé.` });
    setDeleteTarget(null);
    fetchData();
  };

  const copyWelcomeEmail = (info: { email: string; password: string; name: string }) => {
    const text = `Objet : Vos identifiants d'accès – Kairouan Academy

Bonjour ${info.name},

Votre compte a été créé sur la plateforme Kairouan Academy.

Voici vos identifiants de connexion :
• Adresse email : ${info.email}
• Mot de passe temporaire : ${info.password}

Connectez-vous ici : ${window.location.origin}/connexion

Une fois connecté(e), vous pouvez modifier votre mot de passe depuis votre profil.

Cordialement,
L'équipe Kairouan Academy`;
    navigator.clipboard.writeText(text);
    toast({ title: 'Email copié ✓', description: 'Collez-le dans votre boîte mail et envoyez-le à l\'étudiant.' });
  };

  const isExpired = (e: any) => e.access_expires_at && new Date(e.access_expires_at) <= new Date();

  const enrolledEmails = new Set(enrollments.map(e => e.customer?.email || e.user_email));
  const unenrolledStudents = students.filter(s => !enrolledEmails.has(s.email));

  const filteredEnrollments = enrollments.filter(e => {
    const name = e.customer?.name || e.user_email || '';
    const email = e.customer?.email || e.user_email || '';
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
    const matchCourse = !filterCourse || e.product_id === filterCourse;
    return matchSearch && matchCourse;
  });

  const filteredUnenrolled = filterCourse ? [] : unenrolledStudents.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRows = filteredEnrollments.length + filteredUnenrolled.length;

  const ActionButtons = ({ email, name, studentId, isSuspended }: { email: string; name: string; studentId?: string; isSuspended?: boolean }) => (
    <div className="flex items-center gap-1">
      <button onClick={() => openEnrollDialog(email, name)} title="Inscrire à un cours"
        className="p-1.5 text-gold-100/40 hover:text-gold-400 rounded hover:bg-gold-400/8 transition-colors">
        <BookOpen className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => handleResendLink(email)} title="Renvoyer le lien de connexion"
        className="p-1.5 text-gold-100/40 hover:text-gold-300 rounded hover:bg-forest-800 transition-colors">
        <Mail className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setSuspendTarget({ email, name, suspended: isSuspended || false })}
        title={isSuspended ? 'Réactiver le compte' : 'Suspendre le compte'}
        className={`p-1.5 rounded transition-colors ${isSuspended ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10' : 'text-gold-100/30 hover:text-amber-400 hover:bg-amber-400/8'}`}>
        {isSuspended ? <RefreshCw className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
      </button>
      {studentId && (
        <button onClick={() => setDeleteTarget({ id: studentId, email, name })} title="Supprimer le compte"
          className="p-1.5 text-gold-100/20 hover:text-red-400 rounded hover:bg-red-400/8 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gold-200">Étudiants</h1>
          <p className="text-gold-100/50 text-sm mt-1">
            {students.length} compte{students.length !== 1 ? 's' : ''} · {enrollments.length} inscription{enrollments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="sm:ml-auto flex items-center gap-2 px-4 py-2.5 bg-gold-400 text-forest-950 rounded-xl text-sm font-medium hover:bg-gold-300 transition-colors">
          <Plus className="w-4 h-4" /> Nouvel étudiant
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-100/40" />
          <input type="text" placeholder="Rechercher un étudiant..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gold-400/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40 bg-forest-900 text-gold-200 placeholder:text-gold-100/30" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-100/40" />
          <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gold-400/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40 bg-forest-900 text-gold-200 appearance-none">
            <option value="">Tous les cours</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-forest-900 rounded-xl h-16 animate-pulse" />)}</div>
      ) : totalRows === 0 ? (
        <div className="text-center py-16 bg-forest-900 rounded-2xl border border-dashed border-gold-400/15">
          <Users className="w-10 h-10 text-gold-100/30 mx-auto mb-3" />
          <p className="text-gold-100/50 text-sm">Aucun étudiant trouvé</p>
        </div>
      ) : (
        <div className="bg-forest-900 rounded-xl border border-gold-400/10 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-forest-800/40 border-b border-gold-400/10">
                <th className="text-left px-4 py-3 font-medium text-gold-100/50">Étudiant</th>
                <th className="hidden md:table-cell text-left px-4 py-3 font-medium text-gold-100/50">Cours</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 font-medium text-gold-100/50">Date</th>
                <th className="hidden lg:table-cell text-left px-4 py-3 font-medium text-gold-100/50">Expiration</th>
                <th className="text-left px-4 py-3 font-medium text-gold-100/50">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/8">
              {filteredUnenrolled.map(s => (
                <tr key={`student-${s.email}`} className={`hover:bg-forest-800/30 transition-colors ${s.status === 'suspended' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gold-400/10 rounded-full flex items-center justify-center text-gold-400/60 text-sm font-bold flex-shrink-0">
                        {s.name?.[0]?.toUpperCase() || s.email?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gold-200 truncate max-w-[160px]">{s.name || '—'}</p>
                        <p className="text-xs text-gold-100/40 truncate">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 text-gold-100/30 text-xs italic">Aucune inscription</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gold-100/50">{new Date(s.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="hidden lg:table-cell px-4 py-3 text-gold-100/30 text-xs">—</td>
                  <td className="px-4 py-3">
                    {s.status === 'suspended' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400">
                        <Ban className="w-3 h-3" /> Suspendu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-forest-800 text-gold-100/40">
                        <UserCheck className="w-3 h-3" /> Compte actif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ActionButtons email={s.email} name={s.name || s.email} studentId={s.id} isSuspended={s.status === 'suspended'} />
                  </td>
                </tr>
              ))}

              {filteredEnrollments.map(e => {
                const expired = isExpired(e);
                const studentRecord = students.find(s => s.email === (e.customer?.email || e.user_email));
                const isSuspended = studentRecord?.status === 'suspended';
                return (
                  <tr key={e.id} className={`hover:bg-forest-800/30 transition-colors ${isSuspended ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold-400/15 rounded-full flex items-center justify-center text-gold-400 text-sm font-bold flex-shrink-0">
                          {(e.customer?.name || e.user_email)?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gold-200 truncate max-w-[160px]">{e.customer?.name || e.user_email}</p>
                          <p className="text-xs text-gold-100/40 truncate">{e.customer?.email || e.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-gold-100/60 max-w-[200px]">
                      <span className="truncate block">{e.product?.name || e.product_id}</span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-gold-100/50">{new Date(e.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="hidden lg:table-cell px-4 py-3">
                      {e.access_expires_at ? (
                        <span className={`flex items-center gap-1 text-xs ${expired ? 'text-red-500' : 'text-gold-100/50'}`}>
                          <Clock className="w-3 h-3" />
                          {new Date(e.access_expires_at).toLocaleDateString('fr-FR')}
                          {expired && ' (expiré)'}
                        </span>
                      ) : (
                        <span className="text-xs text-gold-100/40">Illimité</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400">
                          <Ban className="w-3 h-3" /> Suspendu
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          e.status === 'active' && !expired ? 'bg-gold-400/15 text-gold-400'
                          : e.status === 'revoked' ? 'bg-red-100 text-red-600'
                          : 'bg-forest-800 text-gold-100/50'
                        }`}>
                          {e.status === 'active' && !expired ? <><CheckCircle className="w-3 h-3" /> Actif</>
                            : e.status === 'revoked' ? 'Révoqué' : 'Expiré'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <ActionButtons
                          email={e.customer?.email || e.user_email}
                          name={e.customer?.name || e.user_email}
                          studentId={studentRecord?.id}
                          isSuspended={isSuspended}
                        />
                        {!isSuspended && (
                          e.status === 'active' ? (
                            <button onClick={() => setRevokeId(e.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50/10 transition-colors">
                              Révoquer
                            </button>
                          ) : (
                            <button onClick={() => handleRestore(e.id)}
                              className="text-xs text-gold-400 font-medium px-2 py-1 rounded hover:bg-gold-400/8 transition-colors">
                              Restaurer
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create student dialog ── */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm bg-forest-950 border border-gold-400/20 text-gold-100">
          <DialogHeader>
            <DialogTitle className="text-gold-200">Nouvel étudiant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Nom complet *</label>
              <input type="text" value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))}
                placeholder="Prénom Nom" className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30 bg-forest-900 text-gold-200 placeholder:text-gold-100/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Email *</label>
              <input type="email" value={newStudent.email} onChange={e => setNewStudent(p => ({ ...p, email: e.target.value }))}
                placeholder="email@exemple.com" className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30 bg-forest-900 text-gold-200 placeholder:text-gold-100/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Mot de passe temporaire</label>
              <input type="text" value={newStudent.password} onChange={e => setNewStudent(p => ({ ...p, password: e.target.value }))}
                placeholder="ex: Kairouan2025! (min. 6 caractères)" className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30 bg-forest-900 text-gold-200 placeholder:text-gold-100/30 font-mono" />
            </div>
            <p className="text-xs text-gold-100/40 bg-forest-900 rounded-lg p-3 border border-gold-400/10">
              {newStudent.password
                ? "Après création, un email de bienvenue sera prêt à copier pour l'envoyer manuellement."
                : "Sans mot de passe, un lien de connexion sera envoyé automatiquement par Supabase."}
            </p>
          </div>
          <DialogFooter>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gold-100/50 hover:text-gold-200">Annuler</button>
            <button onClick={handleCreateStudent} disabled={creating}
              className="px-4 py-2 bg-gold-400 text-forest-950 rounded-lg text-sm font-medium hover:bg-gold-300 transition-colors disabled:opacity-50 flex items-center gap-2">
              {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {creating ? 'Création…' : newStudent.password ? 'Créer le compte' : 'Créer et envoyer le lien'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Welcome email copy modal ── */}
      <Dialog open={!!welcomeEmail} onOpenChange={() => setWelcomeEmail(null)}>
        <DialogContent className="max-w-lg bg-forest-950 border border-gold-400/20 text-gold-100">
          <DialogHeader>
            <DialogTitle className="text-gold-200 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" /> Compte créé — Email prêt à envoyer
            </DialogTitle>
          </DialogHeader>
          {welcomeEmail && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-gold-100/60">Copiez cet email et envoyez-le manuellement depuis votre boîte mail :</p>
              <div className="bg-forest-900 border border-gold-400/15 rounded-lg p-4 text-sm text-gold-200 whitespace-pre-wrap font-mono text-xs leading-relaxed select-all">
{`Objet : Vos identifiants d'accès – Kairouan Academy

Bonjour ${welcomeEmail.name},

Votre compte a été créé sur la plateforme Kairouan Academy.

Vos identifiants de connexion :
• Email : ${welcomeEmail.email}
• Mot de passe : ${welcomeEmail.password}

Accédez à votre espace : ${window.location.origin}/connexion

Une fois connecté(e), vous pouvez changer votre mot de passe
depuis votre profil.

Cordialement,
L'équipe Kairouan Academy`}
              </div>
              <button
                onClick={() => copyWelcomeEmail(welcomeEmail)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gold-400 text-forest-950 rounded-xl font-semibold hover:bg-gold-300 transition-colors">
                <Copy className="w-4 h-4" /> Copier l'email
              </button>
              <p className="text-xs text-gold-100/30 text-center">Collez-le dans votre boîte mail (Gmail, Outlook…) et envoyez-le à l'étudiant.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Enroll student dialog ── */}
      <Dialog open={showEnroll} onOpenChange={setShowEnroll}>
        <DialogContent className="max-w-sm bg-forest-950 border border-gold-400/20 text-gold-100">
          <DialogHeader>
            <DialogTitle className="text-gold-200">Inscrire au cours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {enrollTarget && (
              <p className="text-sm text-gold-100/60">
                Étudiant : <span className="text-gold-200 font-medium">{enrollTarget.name}</span>
                <br /><span className="text-xs">{enrollTarget.email}</span>
              </p>
            )}
            <div>
              <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Cours *</label>
              <select value={enrollForm.product_id} onChange={e => setEnrollForm(p => ({ ...p, product_id: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30 bg-forest-900 text-gold-200">
                <option value="">Sélectionner un cours…</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gold-100/60 mb-1.5">Date d'expiration (optionnel)</label>
              <input type="date" value={enrollForm.access_expires_at} onChange={e => setEnrollForm(p => ({ ...p, access_expires_at: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/30 bg-forest-900 text-gold-200" />
              <p className="text-xs text-gold-100/30 mt-1">Laisser vide pour un accès illimité.</p>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowEnroll(false)} className="px-4 py-2 text-sm text-gold-100/50 hover:text-gold-200">Annuler</button>
            <button onClick={handleEnroll} disabled={enrolling}
              className="px-4 py-2 bg-gold-400 text-forest-950 rounded-lg text-sm font-medium hover:bg-gold-300 transition-colors disabled:opacity-50 flex items-center gap-2">
              {enrolling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {enrolling ? 'Inscription…' : 'Inscrire au cours'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Suspend confirm ── */}
      <AlertDialog open={!!suspendTarget} onOpenChange={() => setSuspendTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {suspendTarget?.suspended ? 'Réactiver ce compte ?' : 'Suspendre ce compte ?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {suspendTarget?.suspended
                ? `${suspendTarget.name} pourra à nouveau accéder à ses cours.`
                : `${suspendTarget?.name} n'aura plus accès à aucun cours. Toutes ses inscriptions seront révoquées. Vous pouvez réactiver le compte à tout moment.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspend}
              className={suspendTarget?.suspended ? 'bg-gold-400 hover:bg-gold-300 text-forest-950' : 'bg-amber-600 hover:bg-amber-700'}>
              {suspendTarget?.suspended ? 'Réactiver' : 'Suspendre'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete confirm ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer définitivement ce compte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte de <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email}) sera supprimé. Cette action est irréversible. L'historique des cours reste conservé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Revoke confirm ── */}
      <AlertDialog open={!!revokeId} onOpenChange={() => setRevokeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Révoquer cet accès ?</AlertDialogTitle>
            <AlertDialogDescription>L'étudiant n'aura plus accès au cours. Vous pourrez restaurer l'accès ultérieurement.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevoke} className="bg-red-600 hover:bg-red-700">Révoquer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminStudents;
