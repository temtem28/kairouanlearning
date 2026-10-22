import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Play, CheckCircle, Lock, ChevronLeft, ChevronRight, Award, BookOpen, ArrowLeft, Download, FileText } from 'lucide-react';
import LessonContent from '@/components/LessonContent';

type LessonRow = {
  id: string;
  title: string;
  video_url?: string | null;
  audio_url?: string | null;
  content?: string | null;
  duration_minutes?: number;
  is_free_preview?: boolean;
  position?: number;
  attachments?: { label: string; url: string }[] | null;
  metadata?: { attachments?: { label: string; url: string }[] } | null;
};

type ModuleRow = {
  id: string;
  title: string;
  position?: number;
  sequential_unlock?: boolean | null;
  lessons: LessonRow[];
  quizzes?: { id: string; title: string; passing_score: number; max_attempts?: number | null }[];
};

async function tryIssueCertificate(
  userEmail: string,
  userName: string,
  product: { id: string; name: string },
  modules: ModuleRow[]
) {
  const allLessons = modules.flatMap((m) => m.lessons || []);
  const allLessonIds = allLessons.map((l) => l.id);
  if (allLessonIds.length === 0) return;

  const { data: prog } = await supabase
    .from('lms_progress')
    .select('lesson_id')
    .eq('user_email', userEmail)
    .eq('completed', true)
    .in('lesson_id', allLessonIds);
  const done = new Set((prog || []).map((p) => p.lesson_id));
  if (!allLessonIds.every((id) => done.has(id))) return;

  const allQuizzes = modules.flatMap((m) => m.quizzes || []);
  for (const q of allQuizzes) {
    const { data: att } = await supabase
      .from('lms_quiz_attempts')
      .select('passed')
      .eq('user_email', userEmail)
      .eq('quiz_id', q.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!att?.passed) return;
  }

  await supabase.from('lms_certificates').upsert(
    {
      user_email: userEmail,
      user_name: userName,
      product_id: product.id,
      course_name: product.name,
      certificate_number: `KA-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    },
    { onConflict: 'user_email,product_id' }
  );
}

const LessonPage: React.FC = () => {
  const { handle, lessonId } = useParams<{ handle: string; lessonId: string }>();
  const { user, isAdmin } = useAuth() as any;
  const navigate = useNavigate();
  const [product, setProduct] = useState<{ id: string; name: string; price?: number; metadata?: any } | null>(null);
  const [isFree, setIsFree] = useState(false);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonRow | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState<{ id: string; title: string; passing_score: number; max_attempts?: number | null } | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; correct: number; total: number } | null>(null);
  const [quizAttemptsUsed, setQuizAttemptsUsed] = useState(0);
  const [quizLockedMaxAttempts, setQuizLockedMaxAttempts] = useState(false);
  const [passedQuizzes, setPassedQuizzes] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    if (!handle) return;
    setLoading(true);

    const { data: p } = await supabase.from('ecom_products').select('id, name, price, metadata').eq('handle', handle).single();
    if (!p) {
      setLoading(false);
      return;
    }
    setProduct(p);
    const free = (p.price || 0) === 0;
    setIsFree(free);

    let isEnrolled = false;
    let accessExpired = false;
    if (isAdmin) {
      // Admins can preview any lesson without enrollment
      isEnrolled = true;
    } else if (user) {
      const { data: enr } = await supabase
        .from('lms_enrollments')
        .select('id, access_expires_at')
        .eq('user_email', user.email)
        .eq('product_id', p.id)
        .eq('status', 'active')
        .maybeSingle();
      if (enr) {
        const exp = (enr as { access_expires_at?: string | null }).access_expires_at;
        if (!exp || new Date(exp) > new Date()) isEnrolled = true;
        else accessExpired = true;
      }
    }
    setEnrolled(isEnrolled || free);

    const { data: mods } = await supabase
      .from('lms_modules')
      .select('*, lessons:lms_lessons(*), quizzes:lms_quizzes(*)')
      .eq('product_id', p.id)
      .order('position');

    let sorted: ModuleRow[] = [];
    if (mods) {
      sorted = mods.map((m: any) => ({
        ...m,
        lessons: (m.lessons || []).sort((a: LessonRow, b: LessonRow) => (a.position || 0) - (b.position || 0)),
        quizzes: m.quizzes || [],
      }));
      setModules(sorted);

      const allLessons = sorted.flatMap((m) => m.lessons);
      const lesson = lessonId ? allLessons.find((l) => l.id === lessonId) : allLessons[0];
      setCurrentLesson(lesson || null);
    } else {
      setModules([]);
    }

    if (user) {
      const { data: prog } = await supabase
        .from('lms_progress')
        .select('lesson_id')
        .eq('user_email', user.email)
        .eq('completed', true);
      if (prog) setCompletedLessons(new Set(prog.map((x) => x.lesson_id)));

      // Load passed quizzes for this product
      const allQuizIds = sorted.flatMap(m => m.quizzes || []).map(q => q.id);
      if (allQuizIds.length > 0) {
        const { data: attempts } = await supabase
          .from('lms_quiz_attempts')
          .select('quiz_id, passed')
          .eq('user_email', user.email)
          .in('quiz_id', allQuizIds)
          .eq('passed', true);
        if (attempts) setPassedQuizzes(new Set(attempts.map(a => a.quiz_id)));
      }
    } else {
      setCompletedLessons(new Set());
      setPassedQuizzes(new Set());
    }

    const allLessonsFlat = sorted.flatMap((m) => m.lessons);
    const active = lessonId ? allLessonsFlat.find((l) => l.id === lessonId) : allLessonsFlat[0];
    const previewOk = !!active?.is_free_preview;
    if (!isEnrolled && !previewOk && !free) {
      setLoading(false);
      if (user && accessExpired) navigate(`/cours/${handle}?acces=expire`);
      else navigate(`/cours/${handle}`);
      return;
    }

    setLoading(false);
  }, [handle, lessonId, user, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allLessons = modules.flatMap((m) => m.lessons);
  const moduleIndexForLesson = (lesson: LessonRow) => modules.findIndex((m) => m.lessons?.some((l) => l.id === lesson.id));
  const isModuleSequential = (mod: ModuleRow) => mod.sequential_unlock !== false;

  const isModuleUnlocked = (modIndex: number): boolean => {
    if (modIndex <= 0) return true;
    for (let i = 0; i < modIndex; i++) {
      const mod = modules[i];
      if (!isModuleSequential(mod)) continue;
      // All lessons must be completed
      const lessons = mod.lessons || [];
      if (!lessons.every((l) => completedLessons.has(l.id))) return false;
      // All quizzes in this module must be passed
      const quizzes = mod.quizzes || [];
      if (quizzes.length > 0 && !quizzes.every((q) => passedQuizzes.has(q.id))) return false;
    }
    return true;
  };

  const isLessonUnlocked = (lesson: LessonRow): boolean => {
    if (lesson.is_free_preview) return true;
    if (isFree) return true;
    if (!enrolled) return false;
    const mi = moduleIndexForLesson(lesson);
    if (mi < 0) return false;
    const mod = modules[mi];
    if (!isModuleUnlocked(mi)) return false;
    if (!isModuleSequential(mod)) return true;
    const lessonsInMod = mod.lessons || [];
    const idx = lessonsInMod.findIndex((l) => l.id === lesson.id);
    for (let j = 0; j < idx; j++) {
      if (!completedLessons.has(lessonsInMod[j].id)) return false;
    }
    return true;
  };

  const isQuizUnlocked = (quizId: string): boolean => {
    if (!enrolled && !isFree) return false;
    const mod = modules.find((m) => m.quizzes?.some((q) => q.id === quizId));
    if (!mod) return false;
    const mi = modules.indexOf(mod);
    if (!isModuleUnlocked(mi)) return false;
    return (mod.lessons || []).every((l) => completedLessons.has(l.id));
  };

  const markComplete = async () => {
    if (!user || !currentLesson || !enrolled) return;
    if (!isLessonUnlocked(currentLesson)) return;
    await supabase.from('lms_progress').upsert(
      {
        user_email: user.email,
        lesson_id: currentLesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_email,lesson_id' }
    );
    const next = new Set(completedLessons);
    next.add(currentLesson.id);
    setCompletedLessons(next);
    if (product) {
      await tryIssueCertificate(user.email, user.name, product, modules);
    }
  };

  const loadQuiz = async (quizData: { id: string; title: string; passing_score: number; max_attempts?: number | null }) => {
    if (!isQuizUnlocked(quizData.id)) return;
    if (!user) return;

    const { count } = await supabase
      .from('lms_quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_email', user.email)
      .eq('quiz_id', quizData.id);
    const used = count || 0;
    const max = quizData.max_attempts;
    if (max != null && max > 0 && used >= max) {
      setQuiz(quizData);
      setQuizQuestions([]);
      setAnswers({});
      setQuizResult(null);
      setQuizAttemptsUsed(used);
      setQuizLockedMaxAttempts(true);
      setShowQuiz(true);
      return;
    }

    setQuizLockedMaxAttempts(false);
    const { data: questions } = await supabase
      .from('lms_quiz_questions')
      .select('*')
      .eq('quiz_id', quizData.id)
      .order('position');
    setQuiz(quizData);
    setQuizQuestions(questions || []);
    setAnswers({});
    setQuizResult(null);
    setQuizAttemptsUsed(used);
    setShowQuiz(true);
  };

  const submitQuiz = async () => {
    if (!quiz || !user || quizQuestions.length === 0) return;
    const max = quiz.max_attempts;
    if (max != null && max > 0 && quizAttemptsUsed >= max) {
      return;
    }

    let correct = 0;
    quizQuestions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) correct++;
    });
    const score = Math.round((correct / quizQuestions.length) * 100);
    const passed = score >= quiz.passing_score;

    await supabase.from('lms_quiz_attempts').insert({
      user_email: user.email,
      quiz_id: quiz.id,
      score,
      passed,
      answers: Object.entries(answers).map(([qId, a]) => ({ question_id: qId, answer: a })),
      completed_at: new Date().toISOString(),
    });

    setQuizResult({ score, passed, correct, total: quizQuestions.length });
    setQuizAttemptsUsed((n) => n + 1);

    if (passed) {
      setPassedQuizzes(prev => { const s = new Set(prev); s.add(quiz.id); return s; });
      if (product) await tryIssueCertificate(user.email, user.name, product, modules);
    }
  };

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const previewGuest = !user && (!!currentLesson?.is_free_preview || isFree);

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-gold-400/25 border-t-gold-400 rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-forest-950">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <p className="text-gold-100/60">Cours introuvable.</p>
        </div>
      </div>
    );
  }

  if (!enrolled && !currentLesson?.is_free_preview) {
    return (
      <div className="min-h-screen bg-forest-950">
        <Header />
        <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4">
          <Lock className="w-16 h-16 text-gold-100/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gold-200 mb-3">Accès restreint</h1>
          <p className="text-gold-100/50 mb-6">Inscrivez-vous à ce cours ou connectez-vous pour accéder aux leçons.</p>
          <Link
            to={`/cours/${handle}`}
            className="px-6 py-3 bg-forest-700 text-white rounded-xl font-semibold hover:bg-forest-800 transition-colors"
          >
            Voir le cours
          </Link>
        </div>
      </div>
    );
  }

  const attachments: { label: string; url: string }[] =
    (currentLesson?.attachments as { label: string; url: string }[] | undefined) ||
    currentLesson?.metadata?.attachments ||
    [];

  return (
    <div className="min-h-screen bg-forest-950 flex flex-col">
      <div className="bg-forest-900 border-b border-gold-400/15 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to={`/cours/${handle}`} className="text-gold-100/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-white font-medium truncate">{product.name}</span>
          {previewGuest && (
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
              Aperçu gratuit
            </span>
          )}
        </div>
        <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gold-100/40 hover:text-white lg:hidden">
          <BookOpen className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {showQuiz ? (
            <div className="max-w-3xl mx-auto p-6 md:p-10">
              <h2 className="text-2xl font-bold text-white mb-6">{quiz?.title}</h2>
              {quiz && quizLockedMaxAttempts ? (
                <div className="bg-forest-900 rounded-2xl p-8 text-center text-gold-200">
                  <p className="text-lg mb-2">Nombre maximum de tentatives atteint ({quiz.max_attempts}).</p>
                  <p className="text-sm text-gold-100/40 mb-6">Contactez le support si vous avez besoin d&apos;un nouveau passage.</p>
                  <button type="button" onClick={() => setShowQuiz(false)} className="px-6 py-3 bg-forest-800 text-gold-200 rounded-xl hover:bg-forest-700 transition-colors">
                    Retour aux leçons
                  </button>
                </div>
              ) : quizResult ? (
                <div className="bg-forest-900 rounded-2xl p-8 text-center">
                  <div className={`text-6xl font-bold mb-4 ${quizResult.passed ? 'text-gold-400' : 'text-red-400'}`}>{quizResult.score}%</div>
                  <p className="text-lg text-gold-100/30 mb-2">
                    {quizResult.correct}/{quizResult.total} réponses correctes
                  </p>
                  <p className={`text-lg font-semibold ${quizResult.passed ? 'text-gold-400' : 'text-red-400'}`}>
                    {quizResult.passed ? 'Félicitations ! Quiz réussi !' : `Score minimum requis : ${quiz?.passing_score}%`}
                  </p>
                  <div className="flex gap-3 justify-center mt-6 flex-wrap">
                    <button type="button" onClick={() => setShowQuiz(false)} className="px-6 py-3 bg-forest-800 text-gold-200 rounded-xl hover:bg-forest-700 transition-colors">
                      Retour aux leçons
                    </button>
                    {!quizResult.passed && (quiz?.max_attempts == null || quiz.max_attempts <= 0 || quizAttemptsUsed < quiz.max_attempts) && (
                      <button
                        type="button"
                        onClick={() => {
                          setAnswers({});
                          setQuizResult(null);
                        }}
                        className="px-6 py-3 bg-gold-400 text-white rounded-xl hover:bg-forest-700 transition-colors"
                      >
                        Réessayer
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {quizQuestions.map((q, qi) => (
                    <div key={q.id} className="bg-forest-900 rounded-xl p-6 border border-gold-400/10">
                      <p className="text-white font-medium mb-4">
                        {qi + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {(q.options as string[]).map((opt: string, oi: number) => (
                          <button
                            key={oi}
                            type="button"
                            onClick={() => setAnswers({ ...answers, [q.id]: oi })}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                              answers[q.id] === oi ? 'bg-gold-400 text-forest-950 font-semibold' : 'bg-forest-800 text-gold-100/70 hover:bg-forest-700 hover:text-gold-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {quiz && (quiz.max_attempts == null || quiz.max_attempts <= 0 ? null : (
                    <p className="text-sm text-gold-100/40 text-center">
                      Tentative {quizAttemptsUsed + 1} sur {quiz.max_attempts}
                    </p>
                  ))}
                  <button
                    type="button"
                    onClick={submitQuiz}
                    disabled={Object.keys(answers).length < quizQuestions.length}
                    className="w-full py-4 bg-gold-400 text-white font-semibold rounded-xl hover:bg-forest-700 transition-colors disabled:opacity-50"
                  >
                    Valider le quiz
                  </button>
                </div>
              )}
            </div>
          ) : currentLesson ? (
            <div className="max-w-4xl mx-auto p-6 md:p-10">
              {!isLessonUnlocked(currentLesson) && enrolled && (
                <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  Cette leçon est verrouillée : complétez les leçons précédentes ou le module précédent pour la débloquer.
                </div>
              )}

              {/* Video container — onContextMenu blocks right-click save, pointer-events on overlay blocks drag */}
              <div
                className="aspect-video bg-black rounded-2xl overflow-hidden mb-8 border border-gold-400/15 relative select-none"
                onContextMenu={(e) => e.preventDefault()}
              >
                {currentLesson.video_url ? (
                  (() => {
                    const raw = currentLesson.video_url.trim();
                    let embedUrl = raw;

                    // YouTube — watch?v=, youtu.be/, ou déjà /embed/
                    const ytMatch =
                      raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/) ||
                      raw.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
                    if (ytMatch) {
                      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
                    } else if (raw.includes('iframe.mediadelivery.net')) {
                      embedUrl = `${raw.split('?')[0]}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;
                    } else if (raw.includes('video.bunnycdn.com/play/')) {
                      const match = raw.match(/video\.bunnycdn\.com\/play\/(\d+)\/([a-f0-9-]+)/i);
                      if (match) {
                        embedUrl = `https://iframe.mediadelivery.net/embed/${match[1]}/${match[2]}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;
                      }
                    } else if (/^[a-f0-9-]{36}$/i.test(raw)) {
                      embedUrl = `https://iframe.mediadelivery.net/embed/0/${raw}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;
                    }
                    return (
                      <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        loading="lazy"
                        allow="accelerometer; gyroscope; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ border: 'none' }}
                        title={currentLesson.title}
                      />
                    );
                  })()
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <Play className="w-16 h-16 text-gold-100/60 mb-3" />
                    <p className="text-gold-100/40 font-medium">Vidéo bientôt disponible</p>
                    <p className="text-gold-100/60 text-sm mt-1">Le contenu vidéo de cette leçon est en cours de préparation.</p>
                  </div>
                )}
              </div>

              <h1 className="font-display text-2xl font-bold text-gold-200 mb-4">{currentLesson.title}</h1>
              {currentLesson.duration_minutes != null && currentLesson.duration_minutes > 0 && (
                <p className="text-sm text-gold-100/40 mb-6">{currentLesson.duration_minutes} minutes</p>
              )}

              {/* Audio player */}
              {currentLesson.audio_url && (
                <div className="mb-8 rounded-xl border border-gold-400/15 bg-forest-900/70 p-4">
                  <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-3">Écouter la leçon</p>
                  <audio
                    controls
                    controlsList="nodownload"
                    className="w-full"
                    src={currentLesson.audio_url}
                  >
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                </div>
              )}

              {currentLesson.content && (
                <div className="mb-8">
                  <LessonContent content={currentLesson.content} />
                </div>
              )}

              {attachments.length > 0 && (
                <div className="mb-8 rounded-xl border border-gold-400/15 bg-forest-900/70 p-5">
                  <h3 className="text-sm font-semibold text-gold-100/30 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Fichiers à télécharger
                  </h3>
                  <ul className="space-y-2">
                    {attachments.map((a, i) => (
                      <li key={i}>
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium"
                        >
                          <Download className="w-4 h-4 flex-shrink-0" />
                          {a.label || 'Télécharger'}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Completion link (Google Forms, bonus, etc.) — shown when all lessons done */}
              {(() => {
                const completionLink = product?.metadata?.completion_link;
                const completionLabel = product?.metadata?.completion_link_label || 'Accéder au formulaire de fin de cours';
                const allDone = allLessons.length > 0 && allLessons.every(l => completedLessons.has(l.id));
                if (!completionLink || !allDone || previewGuest) return null;
                return (
                  <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-center gap-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-emerald-300 font-semibold text-sm mb-1">Cours terminé — félicitations !</p>
                      <p className="text-emerald-200/60 text-xs">Une dernière étape vous attend :</p>
                    </div>
                    <a
                      href={completionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 px-4 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
                    >
                      {completionLabel} ↗
                    </a>
                  </div>
                );
              })()}

              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gold-400/10">
                {previewGuest ? (
                  <p className="text-gold-100/40 text-sm">Connectez-vous et achetez le cours pour enregistrer votre progression.</p>
                ) : completedLessons.has(currentLesson.id) ? (
                  <span className="flex items-center gap-2 text-gold-400 font-medium">
                    <CheckCircle className="w-5 h-5" /> Leçon complétée
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={markComplete}
                    disabled={!isLessonUnlocked(currentLesson)}
                    className="px-6 py-3 bg-gold-400 text-white rounded-xl font-semibold hover:bg-forest-700 transition-colors flex items-center gap-2 disabled:opacity-40"
                  >
                    <CheckCircle className="w-5 h-5" /> Marquer comme terminée
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  {prevLesson && isLessonUnlocked(prevLesson) && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuiz(false);
                        navigate(`/cours/${handle}/lecon/${prevLesson.id}`);
                      }}
                      className="px-4 py-2.5 bg-forest-800 text-gold-200 rounded-xl hover:bg-forest-700 transition-colors flex items-center gap-1 text-sm border border-gold-400/10"
                    >
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>
                  )}
                  {nextLesson && isLessonUnlocked(nextLesson) && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuiz(false);
                        navigate(`/cours/${handle}/lecon/${nextLesson.id}`);
                      }}
                      className="px-4 py-2.5 bg-forest-800 text-gold-200 rounded-xl hover:bg-forest-700 transition-colors flex items-center gap-1 text-sm border border-gold-400/10"
                    >
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gold-100/50">Sélectionnez une leçon pour commencer.</div>
          )}
        </div>

        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-forest-900 border-l border-gold-400/10 overflow-y-auto transition-all flex-shrink-0 hidden lg:block`}>
          {sidebarOpen && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gold-100/40 uppercase tracking-wider mb-4">Programme</h3>
              {modules.map((mod, mi) => (
                <div key={mod.id} className="mb-4">
                  <div className="text-xs font-semibold text-gold-400 mb-2 flex items-center gap-2">
                    Module {mi + 1}: {mod.title}
                    {!isModuleUnlocked(mi) && <Lock className="w-3 h-3 text-amber-400" />}
                  </div>
                  {mod.lessons?.map((lesson: LessonRow) => {
                    const unlocked = isLessonUnlocked(lesson);
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        disabled={!unlocked && !lesson.is_free_preview}
                        onClick={() => {
                          if (!unlocked && !lesson.is_free_preview) return;
                          setShowQuiz(false);
                          navigate(`/cours/${handle}/lecon/${lesson.id}`);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 flex items-center gap-2 transition-colors ${
                          currentLesson?.id === lesson.id ? 'bg-gold-400/20 text-gold-300' : 'text-gold-100/50 hover:bg-forest-800 hover:text-gold-200'
                        } ${!unlocked && !lesson.is_free_preview ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {!unlocked && !lesson.is_free_preview ? (
                          <Lock className="w-4 h-4 flex-shrink-0 text-gold-100/50" />
                        ) : completedLessons.has(lesson.id) ? (
                          <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
                        ) : (
                          <Play className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                        {lesson.is_free_preview && <span className="text-[10px] text-amber-400 shrink-0">Aperçu</span>}
                      </button>
                    );
                  })}
                  {mod.quizzes?.map((q) => {
                    const qUnlocked = isQuizUnlocked(q.id);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        disabled={!qUnlocked}
                        onClick={() => qUnlocked && loadQuiz(q)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 flex items-center gap-2 transition-colors ${
                          qUnlocked ? 'text-gold-400 hover:bg-forest-800' : 'text-gold-100/30 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <Award className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{q.title}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
