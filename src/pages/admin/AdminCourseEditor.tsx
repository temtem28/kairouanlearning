import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import {
  ArrowLeft, Save, Plus, Trash2, Edit2, GripVertical, ChevronDown, ChevronUp,
  BookOpen, Video, FileText, HelpCircle, Eye, EyeOff, Paperclip, X, Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Attachment { label: string; url: string }
interface Lesson {
  id?: string; module_id?: string; title: string; content: string;
  video_url: string; duration_minutes: number; position: number;
  is_free_preview: boolean; attachments: Attachment[];
}
interface QuizQuestion {
  id?: string; quiz_id?: string; question: string;
  options: string[]; correct_answer: number; position: number;
}
interface Quiz {
  id?: string; module_id?: string; title: string;
  passing_score: number; max_attempts: number | null;
  questions: QuizQuestion[];
}
interface Module {
  id?: string; product_id?: string; title: string;
  position: number; sequential_unlock: boolean;
  lessons: Lesson[]; quiz: Quiz | null;
}

const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé'];
const TYPES = ['Cours', 'Formation', 'Atelier', 'Certification'];

// ─── Empty factories ──────────────────────────────────────────────────────────
const emptyLesson = (pos: number): Lesson => ({
  title: '', content: '', video_url: '', duration_minutes: 0,
  position: pos, is_free_preview: false, attachments: [],
});
const emptyQuestion = (pos: number): QuizQuestion => ({
  question: '', options: ['', '', '', ''], correct_answer: 0, position: pos,
});
const emptyQuiz = (): Quiz => ({
  title: 'Quiz du module', passing_score: 70, max_attempts: null, questions: [],
});

// ─── Lesson Dialog ────────────────────────────────────────────────────────────
const LessonDialog: React.FC<{
  lesson: Lesson | null;
  open: boolean;
  onClose: () => void;
  onSave: (l: Lesson) => void;
}> = ({ lesson, open, onClose, onSave }) => {
  const [form, setForm] = useState<Lesson>(lesson || emptyLesson(0));
  const [newAttachment, setNewAttachment] = useState({ label: '', url: '' });

  useEffect(() => { setForm(lesson || emptyLesson(0)); }, [lesson]);

  const set = (k: keyof Lesson, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const addAttachment = () => {
    if (!newAttachment.label || !newAttachment.url) return;
    set('attachments', [...form.attachments, { ...newAttachment }]);
    setNewAttachment({ label: '', url: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? 'Modifier la leçon' : 'Nouvelle leçon'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL vidéo (BunnyStream / iframe)</label>
            <input
              value={form.video_url}
              onChange={e => set('video_url', e.target.value)}
              placeholder="https://iframe.mediadelivery.net/embed/..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (Markdown)</label>
            <textarea
              value={form.content}
              onChange={e => set('content', e.target.value)}
              rows={6}
              placeholder="Description, ressources, code..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
              <input
                type="number" min={0}
                value={form.duration_minutes}
                onChange={e => set('duration_minutes', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_free_preview}
                  onChange={e => set('is_free_preview', e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span className="text-sm text-gray-700">Aperçu gratuit</span>
              </label>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pièces jointes</label>
            <div className="space-y-2 mb-2">
              {form.attachments.map((a, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-sm">
                  <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium">{a.label}</span>
                  <span className="text-gray-400 truncate flex-1">{a.url}</span>
                  <button
                    onClick={() => set('attachments', form.attachments.filter((_, j) => j !== i))}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newAttachment.label}
                onChange={e => setNewAttachment(p => ({ ...p, label: e.target.value }))}
                placeholder="Libellé"
                className="w-28 px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                value={newAttachment.url}
                onChange={e => setNewAttachment(p => ({ ...p, url: e.target.value }))}
                placeholder="https://..."
                className="flex-1 px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={addAttachment}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Annuler</button>
          <button
            onClick={() => { if (form.title) onSave(form); }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Check className="w-4 h-4 inline mr-1" />
            Enregistrer
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Quiz Editor ─────────────────────────────────────────────────────────────
const QuizEditor: React.FC<{
  quiz: Quiz;
  onChange: (q: Quiz) => void;
  onDelete: () => void;
}> = ({ quiz, onChange, onDelete }) => {
  const set = (k: keyof Quiz, v: any) => onChange({ ...quiz, [k]: v });

  const addQuestion = () => {
    onChange({ ...quiz, questions: [...quiz.questions, emptyQuestion(quiz.questions.length)] });
  };

  const updateQuestion = (i: number, q: QuizQuestion) => {
    const qs = [...quiz.questions];
    qs[i] = q;
    onChange({ ...quiz, questions: qs });
  };

  const removeQuestion = (i: number) => {
    onChange({ ...quiz, questions: quiz.questions.filter((_, j) => j !== i) });
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span className="font-medium text-gray-900 text-sm">Quiz de ce module</span>
        </div>
        <button onClick={onDelete} className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> Supprimer
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Titre du quiz</label>
          <input
            value={quiz.title}
            onChange={e => set('title', e.target.value)}
            className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Score minimum (%)</label>
          <input
            type="number" min={0} max={100}
            value={quiz.passing_score}
            onChange={e => set('passing_score', parseInt(e.target.value) || 0)}
            className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tentatives max (vide=illimité)</label>
          <input
            type="number" min={1}
            value={quiz.max_attempts ?? ''}
            onChange={e => set('max_attempts', e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="space-y-3">
        {quiz.questions.map((q, qi) => (
          <div key={qi} className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 w-5">Q{qi + 1}</span>
              <input
                value={q.question}
                onChange={e => updateQuestion(qi, { ...q, question: e.target.value })}
                placeholder="Question..."
                className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button onClick={() => removeQuestion(qi)} className="text-gray-300 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pl-7">
              {q.options.map((opt, oi) => (
                <label key={oi} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correct_answer === oi}
                    onChange={() => updateQuestion(qi, { ...q, correct_answer: oi })}
                    className="accent-emerald-600"
                  />
                  <input
                    value={opt}
                    onChange={e => {
                      const opts = [...q.options];
                      opts[oi] = e.target.value;
                      updateQuestion(qi, { ...q, options: opts });
                    }}
                    placeholder={`Option ${oi + 1}`}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={addQuestion}
          className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-800 font-medium"
        >
          <Plus className="w-4 h-4" /> Ajouter une question
        </button>
      </div>
    </div>
  );
};

// ─── Module Card ──────────────────────────────────────────────────────────────
const ModuleCard: React.FC<{
  mod: Module;
  index: number;
  onUpdate: (m: Module) => void;
  onDelete: () => void;
  onEditLesson: (l: Lesson, modIdx: number, lessonIdx: number | null) => void;
  onDeleteLesson: (modIdx: number, lessonIdx: number) => void;
}> = ({ mod, index, onUpdate, onDelete, onEditLesson, onDeleteLesson }) => {
  const [open, setOpen] = useState(index === 0);

  const set = (k: keyof Module, v: any) => onUpdate({ ...mod, [k]: v });

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Module header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(p => !p)}
      >
        <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <input
            value={mod.title}
            onChange={e => { e.stopPropagation(); set('title', e.target.value); }}
            onClick={e => e.stopPropagation()}
            placeholder={`Module ${index + 1}`}
            className="font-semibold text-gray-900 bg-transparent border-0 outline-none w-full text-sm focus:bg-white focus:border focus:border-emerald-300 focus:px-2 focus:rounded transition-all"
          />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-gray-400">{mod.lessons.length} leçon{mod.lessons.length !== 1 ? 's' : ''}</span>
          <label
            className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer"
            onClick={e => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={mod.sequential_unlock}
              onChange={e => set('sequential_unlock', e.target.checked)}
              className="accent-emerald-600"
            />
            Séquentiel
          </label>
          <button
            onClick={e => { e.stopPropagation(); onDelete(); }}
            className="text-gray-300 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Module body */}
      {open && (
        <div className="border-t border-gray-100 p-4 space-y-3">
          {/* Lessons */}
          {mod.lessons.length > 0 && (
            <div className="space-y-2">
              {mod.lessons.map((lesson, li) => (
                <div
                  key={li}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5 group hover:bg-emerald-50 transition-colors"
                >
                  <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                  <div className="flex-shrink-0">
                    {lesson.video_url ? (
                      <Video className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                  <span className="flex-1 text-sm text-gray-700 font-medium truncate">{lesson.title || 'Sans titre'}</span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {lesson.duration_minutes > 0 && <span>{lesson.duration_minutes}min</span>}
                    {lesson.is_free_preview && (
                      <span className="flex items-center gap-0.5 text-emerald-600">
                        <Eye className="w-3 h-3" /> Aperçu
                      </span>
                    )}
                    {lesson.attachments.length > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Paperclip className="w-3 h-3" /> {lesson.attachments.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditLesson(lesson, index, li)}
                      className="p-1 rounded hover:bg-emerald-100 text-emerald-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteLesson(index, li)}
                      className="p-1 rounded hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => onEditLesson(emptyLesson(mod.lessons.length), index, null)}
            className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <Plus className="w-4 h-4" /> Ajouter une leçon
          </button>

          {/* Quiz */}
          <div className="pt-1">
            {mod.quiz ? (
              <QuizEditor
                quiz={mod.quiz}
                onChange={q => set('quiz', q)}
                onDelete={() => set('quiz', null)}
              />
            ) : (
              <button
                onClick={() => set('quiz', emptyQuiz())}
                className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                <HelpCircle className="w-4 h-4" /> Ajouter un quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AdminCourseEditor: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  // Product state
  const [product, setProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState<any>({});
  const [modules, setModules] = useState<Module[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lesson dialog state
  const [lessonDialog, setLessonDialog] = useState<{
    lesson: Lesson | null; modIdx: number; lessonIdx: number | null;
  } | null>(null);

  useEffect(() => { if (productId) fetchData(); }, [productId]);

  const fetchData = async () => {
    setLoading(true);
    const { data: p } = await supabase.from('ecom_products').select('*').eq('id', productId).single();
    if (!p) { navigate('/admin/cours'); return; }
    setProduct(p);
    setProductForm({
      name: p.name || '',
      handle: p.handle || '',
      description: p.description || '',
      price: p.price ? (p.price / 100).toString() : '',
      compare_at_price: p.compare_at_price ? (p.compare_at_price / 100).toString() : '',
      product_type: p.product_type || 'Cours',
      status: p.status || 'draft',
      images: (p.images || []).join('\n'),
      instructor: p.metadata?.instructor || '',
      level: p.metadata?.level || 'Débutant',
      access_days: p.metadata?.access_days?.toString() || '',
      tags: (p.metadata?.tags || []).join(', '),
    });

    // Fetch modules + lessons + quizzes
    const { data: mods } = await supabase
      .from('lms_modules')
      .select('*, lessons:lms_lessons(*), quizzes:lms_quizzes(*, questions:lms_quiz_questions(*))')
      .eq('product_id', productId)
      .order('position');

    if (mods) {
      setModules(mods.map((m: any) => ({
        ...m,
        lessons: (m.lessons || []).sort((a: any, b: any) => a.position - b.position).map((l: any) => ({
          ...l,
          attachments: l.attachments || [],
        })),
        quiz: m.quizzes?.[0]
          ? {
              ...m.quizzes[0],
              questions: (m.quizzes[0].questions || []).sort((a: any, b: any) => a.position - b.position),
            }
          : null,
      })));
    }
    setLoading(false);
  };

  // Save product info
  const saveProduct = async () => {
    setSaving(true);
    const images = productForm.images
      .split('\n')
      .map((s: string) => s.trim())
      .filter(Boolean);
    const tags = productForm.tags
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const { error } = await supabase.from('ecom_products').update({
      name: productForm.name,
      handle: productForm.handle,
      description: productForm.description,
      price: Math.round(parseFloat(productForm.price || '0') * 100),
      compare_at_price: productForm.compare_at_price
        ? Math.round(parseFloat(productForm.compare_at_price) * 100)
        : null,
      product_type: productForm.product_type,
      status: productForm.status,
      images,
      metadata: {
        instructor: productForm.instructor,
        level: productForm.level,
        access_days: productForm.access_days ? parseInt(productForm.access_days) : null,
        tags,
      },
    }).eq('id', productId);

    setSaving(false);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Cours mis à jour' });
    }
  };

  // Save all modules + lessons + quizzes
  const saveContent = async () => {
    setSaving(true);
    try {
      for (let mi = 0; mi < modules.length; mi++) {
        const mod = modules[mi];
        let moduleId = mod.id;

        if (moduleId) {
          await supabase.from('lms_modules').update({
            title: mod.title, position: mi, sequential_unlock: mod.sequential_unlock,
          }).eq('id', moduleId);
        } else {
          const { data } = await supabase.from('lms_modules').insert({
            product_id: productId, title: mod.title, position: mi,
            sequential_unlock: mod.sequential_unlock,
          }).select().single();
          moduleId = data?.id;
        }
        if (!moduleId) continue;

        // Lessons
        for (let li = 0; li < mod.lessons.length; li++) {
          const lesson = mod.lessons[li];
          const lessonData = {
            module_id: moduleId, title: lesson.title, content: lesson.content,
            video_url: lesson.video_url, duration_minutes: lesson.duration_minutes,
            position: li, is_free_preview: lesson.is_free_preview,
            attachments: lesson.attachments,
          };
          if (lesson.id) {
            await supabase.from('lms_lessons').update(lessonData).eq('id', lesson.id);
          } else {
            await supabase.from('lms_lessons').insert(lessonData);
          }
        }

        // Quiz
        if (mod.quiz) {
          let quizId = mod.quiz.id;
          const quizData = {
            module_id: moduleId, title: mod.quiz.title,
            passing_score: mod.quiz.passing_score, max_attempts: mod.quiz.max_attempts,
          };
          if (quizId) {
            await supabase.from('lms_quizzes').update(quizData).eq('id', quizId);
          } else {
            const { data } = await supabase.from('lms_quizzes').insert(quizData).select().single();
            quizId = data?.id;
          }
          if (quizId) {
            for (let qi = 0; qi < mod.quiz.questions.length; qi++) {
              const q = mod.quiz.questions[qi];
              const qData = {
                quiz_id: quizId, question: q.question, options: q.options,
                correct_answer: q.correct_answer, position: qi,
              };
              if (q.id) {
                await supabase.from('lms_quiz_questions').update(qData).eq('id', q.id);
              } else {
                await supabase.from('lms_quiz_questions').insert(qData);
              }
            }
          }
        }
      }
      toast({ title: 'Contenu enregistré' });
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleLessonSave = (lesson: Lesson) => {
    if (!lessonDialog) return;
    const { modIdx, lessonIdx } = lessonDialog;
    const newModules = [...modules];
    if (lessonIdx === null) {
      newModules[modIdx].lessons = [...newModules[modIdx].lessons, lesson];
    } else {
      newModules[modIdx].lessons[lessonIdx] = lesson;
    }
    setModules(newModules);
    setLessonDialog(null);
  };

  const handleDeleteLesson = (modIdx: number, lessonIdx: number) => {
    const lesson = modules[modIdx].lessons[lessonIdx];
    const newModules = [...modules];
    newModules[modIdx].lessons = newModules[modIdx].lessons.filter((_, i) => i !== lessonIdx);
    setModules(newModules);
    if (lesson.id) {
      supabase.from('lms_lessons').delete().eq('id', lesson.id);
    }
  };

  const addModule = () => {
    setModules(prev => [
      ...prev,
      { title: `Module ${prev.length + 1}`, position: prev.length, sequential_unlock: true, lessons: [], quiz: null },
    ]);
  };

  const deleteModule = async (i: number) => {
    const mod = modules[i];
    if (mod.id) {
      await supabase.from('lms_modules').delete().eq('id', mod.id);
    }
    setModules(prev => prev.filter((_, j) => j !== i));
  };

  const setProductField = (k: string, v: any) => setProductForm((p: any) => ({ ...p, [k]: v }));

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="h-48 bg-white rounded-xl border" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/cours" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">{product?.name || 'Cours'}</h1>
          <p className="text-sm text-gray-400">/cours/{product?.handle}</p>
        </div>
        <a
          href={`/cours/${product?.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Eye className="w-4 h-4" /> Aperçu
        </a>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="content">Modules & Leçons</TabsTrigger>
        </TabsList>

        {/* ── Infos générales ── */}
        <TabsContent value="info" className="mt-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  value={productForm.name}
                  onChange={e => setProductField('name', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant URL</label>
                <input
                  value={productForm.handle}
                  onChange={e => setProductField('handle', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Markdown)</label>
              <textarea
                value={productForm.description}
                onChange={e => setProductField('description', e.target.value)}
                rows={5}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                <input
                  type="number" min={0} step={0.01}
                  value={productForm.price}
                  onChange={e => setProductField('price', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix barré (€)</label>
                <input
                  type="number" min={0} step={0.01}
                  value={productForm.compare_at_price}
                  onChange={e => setProductField('compare_at_price', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accès (jours, vide=illimité)</label>
                <input
                  type="number" min={0}
                  value={productForm.access_days}
                  onChange={e => setProductField('access_days', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Formateur</label>
                <input
                  value={productForm.instructor}
                  onChange={e => setProductField('instructor', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select
                  value={productForm.level}
                  onChange={e => setProductField('level', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={productForm.product_type}
                  onChange={e => setProductField('product_type', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images (une URL par ligne)
              </label>
              <textarea
                value={productForm.images}
                onChange={e => setProductField('images', e.target.value)}
                rows={3}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
              />
              {productForm.images?.split('\n').filter(Boolean).map((url: string, i: number) => (
                <img key={i} src={url.trim()} alt="" className="mt-2 h-20 rounded-lg object-cover" />
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par virgule)</label>
              <input
                value={productForm.tags}
                onChange={e => setProductField('tags', e.target.value)}
                placeholder="React, TypeScript, Frontend"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <div className="flex gap-3">
                {['draft', 'active'].map(s => (
                  <label key={s} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-colors ${
                    productForm.status === s ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={productForm.status === s}
                      onChange={() => setProductField('status', s)}
                      className="accent-emerald-600"
                    />
                    <span className="text-sm font-medium capitalize">
                      {s === 'draft' ? 'Brouillon' : 'Publié'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={saveProduct}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer les informations'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* ── Modules & Leçons ── */}
        <TabsContent value="content" className="mt-4">
          <div className="space-y-4">
            {modules.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Aucun module pour l'instant</p>
              </div>
            ) : (
              modules.map((mod, mi) => (
                <ModuleCard
                  key={mi}
                  mod={mod}
                  index={mi}
                  onUpdate={updated => {
                    const next = [...modules];
                    next[mi] = updated;
                    setModules(next);
                  }}
                  onDelete={() => deleteModule(mi)}
                  onEditLesson={(lesson, modIdx, lessonIdx) =>
                    setLessonDialog({ lesson, modIdx, lessonIdx })
                  }
                  onDeleteLesson={handleDeleteLesson}
                />
              ))
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={addModule}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-medium hover:border-emerald-400 hover:text-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter un module
              </button>
              <button
                onClick={saveContent}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 ml-auto"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer le contenu'}
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Lesson dialog */}
      <LessonDialog
        lesson={lessonDialog?.lesson || null}
        open={!!lessonDialog}
        onClose={() => setLessonDialog(null)}
        onSave={handleLessonSave}
      />
    </div>
  );
};

export default AdminCourseEditor;
