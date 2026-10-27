import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { BookOpen, Award, Shield, Clock, Users, Play } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('ecom_products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setCourses(data); setLoading(false); });
  }, []);

  const features = [
    { icon: Play,     title: 'Cours en direct & replay',  desc: 'Sessions en direct avec vos professeurs et replay illimité.' },
    { icon: BookOpen, title: 'Contenu structuré',          desc: 'Modules progressifs du tronc commun jusqu\'à la spécialisation.' },
    { icon: Award,    title: 'Attestation de réussite',    desc: 'Attestation personnalisée délivrée en fin de cursus.' },
    { icon: Shield,   title: 'Quiz & Évaluations',         desc: 'Testez vos acquis à chaque module avec des QCM.' },
    { icon: Clock,    title: 'Accès permanent',            desc: '2 séances par semaine, 4 heures de formation hebdomadaire.' },
    { icon: Users,    title: 'Enseignants qualifiés',      desc: 'Cours dispensés par des savants et professeurs reconnus.' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />

      {/* HERO */}
      <section style={{ backgroundColor: '#e8d9c0' }} className="pt-16 lg:pt-18">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#8a6d3b' }}>
                Kairouan Academy
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6" style={{ color: '#1a1a1a' }}>
                Des sciences<br />islamiques<br />
                <span style={{ color: '#8a6d3b' }}>accessibles à tous</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: '#4a4a4a' }}>
                Formations structurées dispensées par des enseignants qualifiés — avec suivi de progression, quiz et certification.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/catalogue"
                  className="inline-flex items-center px-6 py-3 font-semibold text-sm transition-colors"
                  style={{ backgroundColor: '#1a1a1a', color: '#e8d9c0' }}
                >
                  Découvrir les formations
                </Link>
                <Link
                  to="/connexion"
                  className="inline-flex items-center px-6 py-3 font-semibold text-sm border transition-colors"
                  style={{ borderColor: '#1a1a1a', color: '#1a1a1a' }}
                >
                  Se connecter
                </Link>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center gap-6 text-center">
              <div className="text-5xl font-serif" style={{ color: '#8a6d3b' }}>العلم قبل</div>
              <div className="w-px h-12" style={{ backgroundColor: '#8a6d3b', opacity: 0.4 }} />
              <div className="text-5xl font-serif" style={{ color: '#8a6d3b' }}>القول والعمل</div>
              <p className="text-xs tracking-[0.2em] uppercase mt-2" style={{ color: '#8a6d3b', opacity: 0.7 }}>
                La science avant la parole et l'action
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ backgroundColor: '#1a1a1a' }} className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '110h+', label: 'de formation minimum' },
              { value: '2×',    label: 'séances par semaine' },
              { value: '5',     label: 'disciplines au programme' },
              { value: '98%',   label: 'taux de satisfaction' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold mb-1" style={{ color: '#d4a843' }}>{s.value}</div>
                <div className="text-xs uppercase tracking-wider" style={{ color: '#e8d9c0', opacity: 0.7 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ backgroundColor: '#e8d9c0' }} className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-serif font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Une formation complète et structurée
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#4a4a4a' }}>
              Un programme académique rigoureux pour progresser méthodiquement dans les sciences islamiques.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-sm" style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid rgba(138,109,59,0.15)' }}>
                <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-sm" style={{ backgroundColor: '#1a1a1a' }}>
                  <Icon className="w-5 h-5" style={{ color: '#d4a843' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#1a1a1a' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#4a4a4a' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      {courses.length > 0 && (
        <section style={{ backgroundColor: '#f0e6d0' }} className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#1a1a1a' }}>
                  Nos formations
                </h2>
                <p className="text-sm" style={{ color: '#4a4a4a' }}>
                  Découvrez l'ensemble de notre catalogue de formations islamiques.
                </p>
              </div>
              <Link to="/catalogue" className="text-sm font-semibold underline underline-offset-4" style={{ color: '#8a6d3b' }}>
                Voir tout →
              </Link>
            </div>
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 rounded-sm animate-pulse" style={{ backgroundColor: 'rgba(138,109,59,0.1)' }} />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 6).map(course => (
                  <CourseCard key={course.id} product={course} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ backgroundColor: '#1a1a1a' }} className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4" style={{ color: '#e8d9c0' }}>
            Prêt à commencer votre parcours ?
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: '#e8d9c0', opacity: 0.7 }}>
            Rejoignez des centaines d'étudiants qui progressent chaque semaine dans les sciences islamiques.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/catalogue"
              className="inline-flex items-center px-8 py-3 font-semibold text-sm transition-colors"
              style={{ backgroundColor: '#d4a843', color: '#1a1a1a' }}
            >
              Voir les formations
            </Link>
            <Link
              to="/connexion"
              className="inline-flex items-center px-8 py-3 font-semibold text-sm border transition-colors"
              style={{ borderColor: '#e8d9c0', color: '#e8d9c0' }}
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AppLayout;
