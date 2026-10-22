import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, BookOpen, Award, Play, Lock, CheckCircle, ShoppingCart, ChevronDown, ChevronRight, Users, Star, ArrowLeft } from 'lucide-react';

const CourseDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessExpiredBanner = searchParams.get('acces') === 'expire';
  const { user, isEnrolled } = useAuth();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!handle) return;
      setLoading(true);
      const { data: p } = await supabase
        .from('ecom_products')
        .select('*')
        .eq('handle', handle)
        .single();

      if (p) {
        setProduct(p);
        const free = (p.price || 0) === 0;
        setIsFree(free);
        setInCart(!free && cart.some(i => i.product_id === p.id));

        const { data: mods } = await supabase
          .from('lms_modules')
          .select('*, lessons:lms_lessons(*), quizzes:lms_quizzes(*)')
          .eq('product_id', p.id)
          .order('position');

        if (mods) {
          const sorted = mods.map(m => ({
            ...m,
            lessons: (m.lessons || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0)),
            quizzes: m.quizzes || []
          }));
          setModules(sorted);
          if (sorted.length > 0) setOpenModule(sorted[0].id);
        }

        if (user) {
          const e = await isEnrolled(p.id);
          setEnrolled(e || free);
        } else if (free) {
          setEnrolled(true);
        }
      }
      setLoading(false);
    };
    fetchCourse();
  }, [handle, user]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      product_id: product.id,
      name: product.name,
      sku: product.sku || product.handle,
      price: product.price,
      image: product.images?.[0],
    });
    setInCart(true);
  };

  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const totalQuizzes = modules.reduce((sum, m) => sum + (m.quizzes?.length || 0), 0);
  const totalDuration = modules.reduce((sum, m) =>
    sum + (m.lessons || []).reduce((s: number, l: any) => s + (l.duration_minutes || 0), 0), 0);
  const meta = product?.metadata || {};
  const accessDays = typeof meta.access_days === 'number' && meta.access_days > 0 ? meta.access_days : null;
  const firstLessonId = modules.flatMap((m) => m.lessons || [])[0]?.id;
  const firstFreePreviewId = modules.flatMap((m) => m.lessons || []).find((l: any) => l.is_free_preview)?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-950">
        <Header />
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
          <div className="animate-pulse grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-forest-700 rounded w-3/4" />
              <div className="h-64 bg-forest-700 rounded-2xl" />
              <div className="h-4 bg-forest-700 rounded w-full" />
              <div className="h-4 bg-forest-700 rounded w-2/3" />
            </div>
            <div className="h-96 bg-forest-700 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-forest-950">
        <Header />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-2xl font-bold text-gold-100/70">Cours introuvable</h1>
          <Link to="/catalogue" className="mt-4 inline-flex items-center gap-2 text-gold-400 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Retour au catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-950">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-forest-900 to-forest-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/catalogue" className="inline-flex items-center gap-2 text-gold-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour au catalogue
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-forest-700 text-gold-200 text-xs font-semibold rounded-full">{product.product_type}</span>
            {meta.level && (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                meta.level === 'Débutant' ? 'bg-green-500/20 text-green-300' :
                meta.level === 'Intermédiaire' ? 'bg-amber-500/20 text-amber-300' :
                'bg-red-500/20 text-red-300'
              }`}>{meta.level}</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-6 text-gold-200 text-sm">
            {meta.instructor && <span className="flex items-center gap-2"><Users className="w-4 h-4" />{meta.instructor}</span>}
            {meta.duration && <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{meta.duration}</span>}
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" />{totalLessons || meta.lessons_count || 0} leçons</span>
            <span className="flex items-center gap-2"><Award className="w-4 h-4" />Certificat inclus</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left - Course Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image */}
              {product.images?.[0] && (
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src={product.images[0]} alt={product.name} className="w-full aspect-video object-cover" />
                </div>
              )}

              {/* Description */}
              <div className="bg-forest-900 rounded-2xl p-8 shadow-sm border border-gold-400/10">
                <h2 className="text-2xl font-bold text-gold-200 mb-4">Description du cours</h2>
                <p className="text-gold-100/60 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>

              {/* Curriculum */}
              <div className="bg-forest-900 rounded-2xl p-8 shadow-sm border border-gold-400/10">
                <h2 className="text-2xl font-bold text-gold-200 mb-6">Programme du cours</h2>
                {modules.length === 0 ? (
                  <p className="text-gold-100/50">Le programme détaillé sera bientôt disponible.</p>
                ) : (
                  <div className="space-y-3">
                    {modules.map((mod, mi) => (
                      <div key={mod.id} className="border border-gold-400/10 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                          className="w-full flex items-center justify-between p-5 hover:bg-forest-950 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-gold-400/15 text-gold-400 rounded-lg flex items-center justify-center text-sm font-bold">
                              {mi + 1}
                            </span>
                            <div className="text-left">
                              <h3 className="font-semibold text-gold-200">{mod.title}</h3>
                              <p className="text-xs text-gold-100/50">{mod.lessons?.length || 0} leçons{mod.quizzes?.length > 0 ? ' + Quiz' : ''}</p>
                            </div>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-gold-100/40 transition-transform ${openModule === mod.id ? 'rotate-180' : ''}`} />
                        </button>
                        {openModule === mod.id && (
                          <div className="border-t border-gold-400/10 bg-forest-950/50">
                            {mod.lessons?.map((lesson: any, li: number) => (
                              <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 border-b border-gold-400/10 last:border-0">
                                {(isFree || enrolled || lesson.is_free_preview) ? (
                                  <Play className="w-4 h-4 text-gold-400 flex-shrink-0" />
                                ) : (
                                  <Lock className="w-4 h-4 text-gold-100/40 flex-shrink-0" />
                                )}
                                {(isFree || enrolled || lesson.is_free_preview) && handle ? (
                                  <Link
                                    to={`/cours/${handle}/lecon/${lesson.id}`}
                                    className="text-sm text-gold-400 flex-1 font-medium hover:underline"
                                  >
                                    {lesson.title}
                                  </Link>
                                ) : (
                                  <span className="text-sm text-gold-100/70 flex-1">{lesson.title}</span>
                                )}
                                {isFree && (
                                  <span className="text-xs text-gold-400 font-medium bg-gold-400/8 px-2 py-0.5 rounded-full">Gratuit</span>
                                )}
                                {!isFree && lesson.is_free_preview && (
                                  <span className="text-xs text-gold-400 font-medium bg-gold-400/8 px-2 py-0.5 rounded-full">Aperçu gratuit</span>
                                )}
                                {lesson.duration_minutes > 0 && (
                                  <span className="text-xs text-gold-100/40">{lesson.duration_minutes} min</span>
                                )}
                              </div>
                            ))}
                            {mod.quizzes?.map((quiz: any) => (
                              <div key={quiz.id} className="flex items-center gap-3 px-5 py-3 bg-amber-50/50">
                                <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <span className="text-sm text-gold-100/70 flex-1">{quiz.title}</span>
                                <span className="text-xs text-amber-600 font-medium">Score min: {quiz.passing_score}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-forest-900 rounded-2xl p-8 shadow-lg border border-gold-400/10">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gold-400 mb-1">
                    {isFree ? 'Gratuit' : `${((product.price || 0) / 100).toFixed(2)} €`}
                  </div>
                  <p className="text-sm text-gold-100/50">{isFree ? 'Accès libre, sans inscription' : 'Accès illimité'}</p>
                </div>

                {/* CTA */}
                {isFree ? (
                  firstLessonId && handle ? (
                    <Link
                      to={`/cours/${handle}/lecon/${firstLessonId}`}
                      className="w-full py-4 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Accéder au cours
                    </Link>
                  ) : null
                ) : enrolled ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-4 bg-forest-700 text-white font-semibold rounded-xl hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Continuer le cours
                  </button>
                ) : product?.metadata?.stripe_payment_url ? (
                  <a
                    href={product.metadata.stripe_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold-400/20"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
                    S'inscrire — Payer avec Stripe
                  </a>
                ) : inCart ? (
                  <button
                    onClick={() => navigate('/panier')}
                    className="w-full py-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Voir le panier
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-forest-700 text-white font-semibold rounded-xl hover:bg-forest-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Ajouter au panier
                  </button>
                )}

                {!isFree && !enrolled && firstFreePreviewId && handle && (
                  <Link
                    to={`/cours/${handle}/lecon/${firstFreePreviewId}`}
                    className="mt-3 block w-full py-3 text-center text-sm font-semibold text-forest-300 border border-gold-400/25 rounded-xl hover:bg-gold-400/8 transition-colors"
                  >
                    Voir un aperçu gratuit
                  </Link>
                )}

                <p className="text-center text-xs text-gold-100/40 mt-3">Livraison gratuite - Accès immédiat</p>

                {/* Course Info */}
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-gold-200 text-sm uppercase tracking-wider">Ce cours inclut :</h3>
                  {[
                    totalLessons > 0 ? { icon: Play, text: `${totalLessons} leçon${totalLessons > 1 ? 's' : ''}` } : null,
                    totalQuizzes > 0 ? { icon: CheckCircle, text: `${totalQuizzes} quiz${totalQuizzes > 1 ? 'zes' : ''}` } : null,
                    { icon: Clock, text: accessDays ? `Accès ${accessDays} jours` : 'Accès illimité' },
                    { icon: Award, text: 'Certificat de réussite' },
                    { icon: Users, text: meta.language || 'Français' },
                  ].filter(Boolean).map((item: any, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gold-100/60">
                      <item.icon className="w-4 h-4 text-gold-400 flex-shrink-0" />
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* Instructor */}
                {meta.instructor && (
                  <div className="mt-8 pt-6 border-t border-gold-400/10">
                    <h3 className="font-semibold text-gold-200 text-sm uppercase tracking-wider mb-3">Enseignant</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gold-400/15 rounded-full flex items-center justify-center">
                        <span className="text-gold-400 font-bold">{meta.instructor[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gold-200">{meta.instructor}</div>
                        <div className="text-xs text-gold-100/50">Kairouan Academy</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
