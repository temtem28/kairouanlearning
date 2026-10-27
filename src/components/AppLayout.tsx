import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { BookOpen, Award, Play, Users, Shield, Clock, ChevronRight, GraduationCap, Star, ArrowRight } from 'lucide-react';

const HERO_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/69a6aa28098b4137cb4b5afd_1772530357424_b4433ee9.jpg';

// Ornamental diamond divider
const Ornament = ({ light = false }: { light?: boolean }) => (
  <div className={`section-divider text-2xl ${light ? 'opacity-40' : ''}`}>❖ ✦ ❖</div>
);

const AppLayout: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('ecom_products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (data) {
        setAllCourses(data);
        setFeaturedCourses(data.slice(0, 6));
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const features = [
    { icon: Play,         title: 'Cours en direct & replay',     desc: 'Sessions en direct avec vos professeurs et replay illimité pour revoir les leçons.' },
    { icon: BookOpen,     title: 'Contenu structuré',             desc: 'Modules progressifs du tronc commun jusqu\'à la spécialisation dans chaque discipline.' },
    { icon: Award,        title: 'Attestation de réussite',       desc: 'Attestation personnalisée délivrée en fin de cursus sous conditions de validation.' },
    { icon: Shield,       title: 'Quiz & Évaluations',            desc: 'Testez vos acquis à chaque module avec des QCM et suivez votre progression.' },
    { icon: Clock,        title: 'Accès permanent',               desc: '2 séances par semaine, 4 heures de formation hebdomadaire, à votre rythme.' },
    { icon: Users,        title: 'Enseignants qualifiés',         desc: 'Cours dispensés par des savants et professeurs reconnus, parcours académique certifié.' },
  ];

  const stats = [
    { value: '110h+', label: 'de formation minimum' },
    { value: '2×',    label: 'séances par semaine' },
    { value: '5',     label: 'disciplines au programme' },
    { value: '98%',   label: 'taux de satisfaction' },
  ];

  return (
    <div className="min-h-screen bg-parchment-50">
      <Header />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Kairouan Academy" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/97 via-forest-950/90 to-forest-900/70" />
          {/* Arabesque pattern overlay */}
          <div className="absolute inset-0 bg-arabesque opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-3xl">
            {/* Arabic tagline */}
            <div className="text-gold-400/80 text-xl mb-4 tracking-widest font-light" style={{ fontFamily: 'serif', direction: 'rtl', textAlign: 'left' }}>
              العلم قبل القول والعمل
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold-400/40 bg-gold-400/10 rounded-full text-gold-300 text-xs font-semibold tracking-widest uppercase mb-6 backdrop-blur-sm">
              ❖ &nbsp;Kairouan Classroom &nbsp;❖
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-tight mb-6">
              Cursus de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                Sciences Islamiques
              </span>
              <br />en ligne
            </h1>

            <p className="text-base sm:text-lg text-forest-100/75 mb-3 max-w-2xl leading-relaxed">
              Un programme structuré pour acquérir des bases solides et progresser
              méthodiquement dans les sciences islamiques. Cours dispensés par
              <strong className="text-gold-300 font-semibold"> Ustadh Sayf</strong>.
            </p>

            {/* Key info pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['Minimum 110 heures', 'Année 2026/2027', 'Direct + Replay illimité'].map(t => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-forest-800/60 border border-gold-400/20 text-gold-200/80 backdrop-blur-sm">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold rounded-xl transition-all shadow-lg shadow-gold-400/25 text-base"
              >
                Voir les formations
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/connexion"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-xl border border-white/25 transition-colors text-base backdrop-blur-sm"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-parchment-50 to-transparent" />
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="relative -mt-8 z-10 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-forest-950 rounded-2xl border border-gold-400/20 shadow-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-gold-400">{stat.value}</div>
                <div className="text-xs text-forest-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programme ──────────────────────────────────── */}
      <section className="py-24 bg-parchment-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-4">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-[0.25em]">Notre Cursus</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-950 mt-3 mb-3">
              Contenu du programme
            </h2>
            <Ornament />
            <p className="text-forest-700/80 mt-4 leading-relaxed">
              Un programme de <strong>minimum 110 heures</strong> organisé autour
              de 5 disciplines fondamentales pour une formation sérieuse et qualitative.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
            {[
              { title: 'Commentaire de Mayyara',   sub: 'Ibn \'Āshir',      hours: '40H', color: 'from-forest-900 to-forest-800' },
              { title: 'Éthique de l\'étudiant',   sub: 'Imam al-Nawawî',   hours: '30H', color: 'from-forest-800 to-forest-700' },
              { title: 'Commentaire al-Waraqāt',   sub: 'Imam al-Ḥaṭṭāb',  hours: '20H', color: 'from-forest-800 to-forest-700' },
              { title: 'Nourbat al Fikar',          sub: 'Ibn Hajar',        hours: '14H', color: 'from-forest-900 to-forest-800' },
              { title: 'Fondements malikites',      sub: 'نظم ابن أبي كف', hours: '6H',  color: 'from-forest-800 to-forest-700' },
            ].map((item, i) => (
              <div key={i} className={`bg-gradient-to-b ${item.color} rounded-2xl p-5 border border-gold-400/20 flex flex-col justify-between min-h-[160px]`}>
                <div>
                  <div className="font-display text-2xl font-bold text-gold-400 mb-2">{item.hours}</div>
                  <h3 className="text-sm font-semibold text-white leading-snug mb-1">{item.title}</h3>
                  <p className="text-xs text-forest-300">{item.sub}</p>
                </div>
                <div className="mt-3 h-px bg-gold-400/20" />
              </div>
            ))}
          </div>

          <div className="mt-8 bg-forest-950/90 border border-gold-400/20 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-gold-400 text-2xl">⏱</span>
              <span className="font-bold text-white">Total minimum : <span className="text-gold-400">110 heures</span></span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-forest-300">
              {['2 séances / semaine', '4h de formation / semaine', 'Cours direct + replay', '2h par séance (cours + Q&R)'].map(t => (
                <span key={t} className="px-3 py-1 rounded-full border border-forest-700 bg-forest-900/50">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cours ─────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-gold-600 uppercase tracking-[0.25em]">Formations</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-950 mt-2">Nos cours disponibles</h2>
            </div>
            <Link to="/catalogue" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-gold-600 transition-colors">
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <Ornament />

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-parchment-100 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-parchment-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-parchment-200 rounded w-1/4" />
                    <div className="h-5 bg-parchment-200 rounded w-3/4" />
                    <div className="h-3 bg-parchment-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {(featuredCourses.length > 0 ? featuredCourses : allCourses.slice(0, 6)).map(course => (
                <CourseCard key={course.id} product={course} />
              ))}
              {featuredCourses.length === 0 && allCourses.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="text-4xl mb-4">📚</div>
                  <p className="text-forest-600 font-medium">Les formations arrivent prochainement</p>
                  <p className="text-forest-400 text-sm mt-1">Rentrée prévue en septembre 2026</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-10 md:hidden">
            <Link to="/catalogue" className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-gold-300 font-semibold rounded-xl hover:bg-forest-800 transition-colors border border-gold-400/20">
              Voir tous les cours <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ce que comprend l'inscription ──────────────── */}
      <section className="py-24 bg-parchment-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-[0.25em]">Votre inscription comprend</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-950 mt-3 mb-3">
              Tout pour réussir
            </h2>
            <Ornament />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white p-7 rounded-2xl border border-parchment-200 hover:border-gold-400/50 hover:shadow-lg hover:shadow-gold-400/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-forest-900 group-hover:bg-forest-800 rounded-xl flex items-center justify-center mb-5 transition-colors">
                  <feature.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="font-display text-base font-bold text-forest-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-forest-600/80 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ──────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-[0.25em]">Comment ça marche</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-950 mt-3 mb-3">
              Commencez en 3 étapes
            </h2>
            <Ornament />
          </div>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {[
              { step: '01', title: 'Choisissez votre formation', desc: 'Parcourez notre catalogue et sélectionnez le cursus qui correspond à votre niveau et vos objectifs.' },
              { step: '02', title: 'Inscrivez-vous & réglez', desc: 'Créez votre compte, procédez au paiement sécurisé. Accès immédiat à votre espace étudiant.' },
              { step: '03', title: 'Apprenez & obtenez votre attestation', desc: 'Suivez les modules, répondez aux quiz et recevez votre attestation de réussite personnalisée.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="font-display text-[5rem] font-black text-parchment-200 leading-none mb-2 group-hover:text-parchment-300 transition-colors">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-bold text-forest-900 mb-3 -mt-6 relative">{item.title}</h3>
                <p className="text-sm text-forest-600/80 leading-relaxed">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 -right-5 text-gold-300/40">
                    <ArrowRight className="w-7 h-7" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages ──────────────────────────────── */}
      <section className="py-24 bg-parchment-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-[0.25em]">Témoignages</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-950 mt-3 mb-3">
              Ce que disent nos étudiants
            </h2>
            <Ornament />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              { name: 'Fatima B.',  text: 'La qualité des cours est exceptionnelle. La progression est bien pensée et les enseignants maîtrisent parfaitement leur discipline.', course: 'Sciences islamiques' },
              { name: 'Ahmed K.',   text: 'Grâce à Kairouan Academy, j\'ai pu approfondir mes connaissances tout en étant suivi de près. Les replays sont indispensables.', course: 'Fiqh malikite' },
              { name: 'Sarah M.',   text: 'Une formation sérieuse et rigoureuse, à la hauteur de mes attentes. Je me sens réellement progresser chaque semaine.', course: 'Aqida' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-7 rounded-2xl border border-parchment-200 shadow-sm hover:shadow-md hover:border-gold-400/30 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-sm text-forest-700 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-forest-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gold-400 font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-forest-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gold-600">{t.course}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="relative py-24 bg-forest-950 overflow-hidden">
        <div className="absolute inset-0 bg-arabesque opacity-10" />
        {/* Top ornamental border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-950 via-gold-400 to-forest-950" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Ornament light />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-4 mb-2">
            Une formation sérieuse et qualitative,
          </h2>
          <p className="font-display text-2xl text-gold-400 italic mb-6">
            à la hauteur de vos attentes.
          </p>
          <p className="text-forest-300 text-sm mb-8 max-w-xl mx-auto">
            Rejoignez des étudiants qui ont choisi Kairouan Academy pour approfondir leurs connaissances islamiques avec méthode et rigueur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalogue"
              className="px-8 py-4 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold rounded-xl transition-colors shadow-lg shadow-gold-400/20"
            >
              S'inscrire dès maintenant
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent hover:bg-forest-900 text-white font-semibold rounded-xl border border-gold-400/30 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
          <div className="mt-6 section-divider text-sm opacity-30">❖ ✦ ❖</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AppLayout;
