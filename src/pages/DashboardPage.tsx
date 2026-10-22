import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { downloadCertificatePdf } from '@/lib/certificatePdf';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Award, CheckCircle, Play, BarChart3, Download, User, LogOut, Lock } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, logout, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, { total: number; completed: number }>>({});
  const [certificates, setCertificates] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'courses' | 'quizzes' | 'certificates' | 'profile'>('courses');

  // Password change state
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/connexion'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const { data: enr } = await supabase
      .from('lms_enrollments')
      .select('*, product:ecom_products(*)')
      .eq('user_email', user.email)
      .eq('status', 'active');

    if (enr) {
      setEnrollments(enr);
      const progressMap: Record<string, { total: number; completed: number }> = {};
      for (const e of enr) {
        const { data: modules } = await supabase.from('lms_modules').select('id').eq('product_id', e.product_id);
        if (modules && modules.length > 0) {
          const moduleIds = modules.map(m => m.id);
          const { data: lessons } = await supabase.from('lms_lessons').select('id').in('module_id', moduleIds);
          const totalLessons = lessons?.length || 0;
          if (totalLessons > 0) {
            const lessonIds = lessons!.map(l => l.id);
            const { data: prog } = await supabase.from('lms_progress').select('id')
              .eq('user_email', user.email).in('lesson_id', lessonIds).eq('completed', true);
            progressMap[e.product_id] = { total: totalLessons, completed: prog?.length || 0 };
          } else {
            progressMap[e.product_id] = { total: 0, completed: 0 };
          }
        }
      }
      setProgress(progressMap);
    }

    const { data: certs } = await supabase
      .from('lms_certificates')
      .select('*, product:ecom_products(metadata)')
      .eq('user_email', user.email);
    if (certs) setCertificates(certs);

    const { data: qa } = await supabase
      .from('lms_quiz_attempts')
      .select('*, quiz:lms_quizzes(title, passing_score)')
      .eq('user_email', user.email)
      .order('completed_at', { ascending: false });
    if (qa) setQuizAttempts(qa);

    setLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);
    if (pwNew.length < 6) { setPwError('Le mot de passe doit faire au moins 6 caractères.'); return; }
    if (pwNew !== pwConfirm) { setPwError('Les mots de passe ne correspondent pas.'); return; }
    setPwLoading(true);
    const ok = await updatePassword(pwNew);
    setPwLoading(false);
    if (ok) {
      setPwSuccess(true);
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
    }
  };

  if (!user) return null;

  const completedCourses = enrollments.filter(e => {
    const p = progress[e.product_id];
    return p && p.total > 0 && p.completed >= p.total;
  });

  const allTabs = [
    { id: 'courses' as const,      label: 'Mes cours',    icon: BookOpen,   count: enrollments.length,   always: true },
    { id: 'quizzes' as const,      label: 'Quiz',         icon: BarChart3,  count: quizAttempts.length,  always: false },
    { id: 'certificates' as const, label: 'Certificats',  icon: Award,      count: certificates.length,  always: false },
    { id: 'profile' as const,      label: 'Mon profil',   icon: User,       count: undefined,            always: true },
  ];
  const tabs = allTabs.filter(t => t.always || (t.count !== undefined && t.count > 0));

  const inputCls = "w-full px-4 py-2.5 bg-white border border-black/15 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20";

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />
      <div className="pt-16 lg:pt-18">

        {/* Dashboard Header */}
        <div className="bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold text-gold-400 font-display">
                {user.name[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white">Bonjour, {user.name} !</h1>
                <p className="text-white/40 text-sm">{user.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {[
                { label: 'Cours en cours',   value: enrollments.length - completedCourses.length, icon: Play },
                { label: 'Cours complétés',  value: completedCourses.length,                       icon: CheckCircle },
                { label: 'Quiz réalisés',    value: quizAttempts.length,                            icon: BarChart3 },
                { label: 'Certificats',      value: certificates.length,                            icon: Award },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4">
                  <s.icon className="w-4 h-4 text-gold-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs + Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-20">
          {/* Tab nav */}
          <div className="flex gap-0 border border-black/10 bg-white mb-8 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  tab === t.id
                    ? 'border-black text-black bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900 bg-white'
                }`}>
                <t.icon className="w-4 h-4" />
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs font-bold ${tab === t.id ? 'bg-black text-white' : 'bg-black/8 text-gray-600'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-black/8 p-6 animate-pulse">
                  <div className="h-4 bg-gray-100 w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* ── Courses ── */}
              {tab === 'courses' && (
                <div>
                  {enrollments.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-black/8">
                      <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">Aucun cours inscrit</h3>
                      <p className="text-gray-500 mb-6 text-sm">Explorez notre catalogue pour commencer votre apprentissage.</p>
                      <Link to="/catalogue" className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors text-sm">
                        Explorer les cours
                      </Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {enrollments.map(e => {
                        const p = progress[e.product_id] || { total: 0, completed: 0 };
                        const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
                        const course = e.product;
                        const completionLink = course?.metadata?.completion_link;
                        const completionLabel = course?.metadata?.completion_link_label || 'Formulaire de fin de cours';
                        const isCourseComplete = p.total > 0 && p.completed >= p.total;
                        return (
                          <div key={e.id} className="flex flex-col">
                          <Link to={`/cours/${course?.handle}`}
                            className="bg-white border border-black/8 hover:border-black/20 hover:shadow-md p-5 flex gap-4 group transition-all">
                            {course?.images?.[0] ? (
                              <img src={course.images[0]} alt="" className="w-20 h-20 object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-20 h-20 bg-black flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl text-gold-400/30" style={{ fontFamily: 'Georgia' }}>ك</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display font-bold text-gray-900 group-hover:text-black truncate transition-colors">{course?.name}</h3>
                              <p className="text-xs text-gray-400 mt-0.5">{course?.metadata?.instructor}</p>
                              <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-400">{p.completed}/{p.total} leçons</span>
                                  <span className="font-bold text-gray-700">{pct}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 overflow-hidden">
                                  <div className="h-full bg-black transition-all" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            </div>
                          </Link>
                          {isCourseComplete && completionLink && (
                            <a
                              href={completionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 py-2.5 bg-emerald-50 border border-emerald-200 border-t-0 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                            >
                              ✓ Cours terminé — {completionLabel} ↗
                            </a>
                          )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── Quizzes ── */}
              {tab === 'quizzes' && (
                <div>
                  {quizAttempts.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-black/8">
                      <BarChart3 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <h3 className="font-display text-xl font-semibold text-gray-900">Aucun quiz réalisé</h3>
                      <p className="text-gray-500 mt-2 text-sm">Complétez des modules pour accéder aux quiz.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {quizAttempts.map(qa => (
                        <div key={qa.id} className="bg-white border border-black/8 p-5 flex items-center gap-4">
                          <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${qa.passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                            {qa.passed
                              ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                              : <BarChart3 className="w-5 h-5 text-red-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">{qa.quiz?.title}</h3>
                            <p className="text-xs text-gray-400">{new Date(qa.completed_at).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-lg font-bold ${qa.passed ? 'text-emerald-600' : 'text-red-500'}`}>{qa.score}%</div>
                            <div className="text-xs text-gray-400">Min: {qa.quiz?.passing_score}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Certificates ── */}
              {tab === 'certificates' && (
                <div>
                  {certificates.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-black/8">
                      <Award className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <h3 className="font-display text-xl font-semibold text-gray-900">Aucun certificat</h3>
                      <p className="text-gray-500 mt-2 text-sm">Complétez un cours pour obtenir votre certificat.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {certificates.map(cert => (
                        <div key={cert.id} className="bg-white border border-black/8 p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                              <Award className="w-6 h-6 text-gold-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display font-bold text-gray-900 leading-tight">{cert.course_name}</h3>
                              <p className="text-xs text-gray-400 mt-1">Délivré le {new Date(cert.issued_at).toLocaleDateString('fr-FR')}</p>
                              <p className="text-xs text-gray-300 font-mono">N° {cert.certificate_number}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => downloadCertificatePdf({
                              userName: user.name,
                              courseName: cert.course_name,
                              certificateNumber: cert.certificate_number,
                              issuedAt: new Date(cert.issued_at).toLocaleDateString('fr-FR'),
                              customTitle: cert.product?.metadata?.cert_title || null,
                              customSubtitle: cert.product?.metadata?.cert_subtitle || null,
                              customDate: cert.product?.metadata?.cert_date || null,
                            })}
                            className="w-full py-2.5 border border-black/15 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
                            <Download className="w-4 h-4" />
                            Télécharger le certificat PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Profile ── */}
              {tab === 'profile' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Info */}
                  <div className="bg-white border border-black/8 p-6">
                    <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <User className="w-4 h-4" /> Informations du compte
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nom</label>
                        <input value={user.name} readOnly
                          className="w-full px-4 py-2.5 bg-gray-50 border border-black/10 text-sm text-gray-700 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                        <input value={user.email} readOnly
                          className="w-full px-4 py-2.5 bg-gray-50 border border-black/10 text-sm text-gray-700 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Rôle</label>
                        <div className="px-4 py-2.5 bg-gray-50 border border-black/10 text-sm text-gray-700">
                          {user.role === 'admin' ? 'Administrateur' : user.role === 'collaborator' ? 'Collaborateur' : 'Étudiant'}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { logout(); navigate('/'); }}
                      className="mt-6 w-full py-2.5 border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm">
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>

                  {/* Change password */}
                  <div className="bg-white border border-black/8 p-6">
                    <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Changer le mot de passe
                    </h2>
                    {pwSuccess ? (
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <p className="text-sm text-emerald-700 font-medium">Mot de passe mis à jour avec succès.</p>
                      </div>
                    ) : (
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nouveau mot de passe</label>
                          <input type="password" value={pwNew} onChange={e => setPwNew(e.target.value)}
                            required minLength={6} className={inputCls} placeholder="••••••••" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirmer le mot de passe</label>
                          <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)}
                            required className={inputCls} placeholder="••••••••" />
                        </div>
                        {pwError && (
                          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2">{pwError}</p>
                        )}
                        <button type="submit" disabled={pwLoading}
                          className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                          {pwLoading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent" /> : 'Enregistrer'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
