import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import {
  Plus, Search, Edit2, Trash2, Eye, BookOpen,
  MoreVertical, Users, ToggleLeft, ToggleRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé'];
const TYPES = ['Cours', 'Formation', 'Atelier', 'Certification'];

const AdminCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    handle: '',
    description: '',
    price: '',
    product_type: 'Cours',
    status: 'draft',
    instructor: '',
    level: 'Débutant',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ecom_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setCourses(data);
      // Fetch enrollment counts
      const counts: Record<string, number> = {};
      await Promise.all(
        data.map(async (c: any) => {
          const { count } = await supabase
            .from('lms_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', c.id);
          counts[c.id] = count || 0;
        })
      );
      setEnrollmentCounts(counts);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (course: any) => {
    const newStatus = course.status === 'active' ? 'draft' : 'active';
    const { error } = await supabase
      .from('ecom_products')
      .update({ status: newStatus })
      .eq('id', course.id);
    if (!error) {
      setCourses(prev => prev.map(c => c.id === course.id ? { ...c, status: newStatus } : c));
      toast({ title: `Cours ${newStatus === 'active' ? 'publié' : 'passé en brouillon'}` });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('ecom_products').delete().eq('id', deleteId);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setCourses(prev => prev.filter(c => c.id !== deleteId));
      toast({ title: 'Cours supprimé' });
    }
    setDeleteId(null);
  };

  const handleCreate = async () => {
    if (!newCourse.name || !newCourse.handle) {
      toast({ title: 'Champs requis', description: 'Titre et identifiant URL obligatoires.', variant: 'destructive' });
      return;
    }
    setCreating(true);
    const { data, error } = await supabase
      .from('ecom_products')
      .insert({
        name: newCourse.name,
        handle: newCourse.handle.toLowerCase().replace(/\s+/g, '-'),
        description: newCourse.description,
        price: Math.round(parseFloat(newCourse.price || '0') * 100),
        product_type: newCourse.product_type,
        status: 'draft',
        metadata: { instructor: newCourse.instructor, level: newCourse.level },
        images: [],
      })
      .select()
      .single();

    setCreating(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Cours créé', description: 'Vous pouvez maintenant ajouter des modules et leçons.' });
      setShowCreate(false);
      navigate(`/admin/cours/${data.id}`);
    }
  };

  const filtered = courses.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.handle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cours</h1>
          <p className="text-gray-500 text-sm mt-1">{courses.length} cours au total</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="sm:ml-auto flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau cours
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un cours..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucun cours trouvé</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Créer un cours
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Cours</th>
                <th className="hidden md:table-cell text-left px-4 py-3 font-medium text-gray-500">Type</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 font-medium text-gray-500">Prix</th>
                <th className="hidden lg:table-cell text-left px-4 py-3 font-medium text-gray-500">Inscrits</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(course => (
                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {course.images?.[0] ? (
                          <img src={course.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-gray-400 m-auto mt-2.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">{course.name}</p>
                        <p className="text-xs text-gray-400">{course.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 text-gray-600">{course.product_type || '—'}</td>
                  <td className="hidden sm:table-cell px-4 py-3 font-medium text-gray-900">
                    {course.price ? `${(course.price / 100).toFixed(2)} €` : 'Gratuit'}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3.5 h-3.5" />
                      {enrollmentCounts[course.id] ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      course.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {course.status === 'active' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/cours/${course.id}`} className="flex items-center gap-2">
                            <Edit2 className="w-3.5 h-3.5" /> Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`/cours/${course.handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5" /> Voir la page
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(course)}
                          className="flex items-center gap-2"
                        >
                          {course.status === 'active'
                            ? <><ToggleLeft className="w-3.5 h-3.5" /> Passer en brouillon</>
                            : <><ToggleRight className="w-3.5 h-3.5" /> Publier</>
                          }
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(course.id)}
                          className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau cours</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                type="text"
                value={newCourse.name}
                onChange={e => {
                  const name = e.target.value;
                  const handle = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  setNewCourse(prev => ({ ...prev, name, handle }));
                }}
                placeholder="ex. Maîtriser React 18"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant URL *</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">/cours/</span>
                <input
                  type="text"
                  value={newCourse.handle}
                  onChange={e => setNewCourse(prev => ({ ...prev, handle: e.target.value }))}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCourse.price}
                  onChange={e => setNewCourse(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select
                  value={newCourse.level}
                  onChange={e => setNewCourse(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Formateur</label>
              <input
                type="text"
                value={newCourse.instructor}
                onChange={e => setNewCourse(prev => ({ ...prev, instructor: e.target.value }))}
                placeholder="Nom du formateur"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newCourse.product_type}
                onChange={e => setNewCourse(prev => ({ ...prev, product_type: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {creating ? 'Création...' : 'Créer & modifier'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce cours ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les modules, leçons et inscriptions liées seront également supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCourses;
