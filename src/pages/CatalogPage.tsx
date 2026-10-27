import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { SlidersHorizontal } from 'lucide-react';

const CatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    supabase
      .from('ecom_products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) { setCourses(data); setFiltered(data); }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...courses];
    if (selectedType) result = result.filter(c => c.product_type === selectedType);
    if (selectedLevel) result = result.filter(c => c.metadata?.level === selectedLevel);
    switch (sortBy) {
      case 'price-asc':  result.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case 'price-desc': result.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      case 'name':       result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    setFiltered(result);
  }, [selectedType, selectedLevel, sortBy, courses]);

  const types  = [...new Set(courses.map(c => c.product_type).filter(Boolean))];
  const levels = [...new Set(courses.map(c => c.metadata?.level).filter(Boolean))];
  const hasFilters = selectedType || selectedLevel || sortBy !== 'newest';
  const clearFilters = () => { setSelectedType(''); setSelectedLevel(''); setSortBy('newest'); };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />

      {/* Hero */}
      <section className="bg-black pt-16 lg:pt-18">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-gold-400/60 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Kairouan Academy</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Catalogue des formations</h1>
          <p className="text-white/40 mt-2 text-sm">Sciences islamiques, langue arabe et spiritualité.</p>
        </div>
      </section>

      {/* Filters bar — no search, only type/level/sort */}
      <section className="sticky top-16 lg:top-18 z-30 bg-white border-b border-black/8 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-black/15 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/20">
              <option value="">Toutes les matières</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-black/15 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/20">
              <option value="">Tous les niveaux</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 border border-black/15 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/20">
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Alphabétique</option>
            </select>

            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-black underline">
                Réinitialiser
              </button>
            )}

            <span className="ml-auto text-xs text-gray-400">
              {filtered.length} formation{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-black/8 animate-pulse">
                  <div className="aspect-video bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-100 w-1/4" />
                    <div className="h-5 bg-gray-100 w-3/4" />
                    <div className="h-3 bg-gray-100 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white border border-black/8">
              <SlidersHorizontal className="w-10 h-10 text-gray-200 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-500 mb-6 text-sm">Essayez de modifier vos filtres.</p>
              <button onClick={clearFilters} className="px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors text-sm">
                Voir toutes les formations
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => <CourseCard key={course.id} product={course} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CatalogPage;
