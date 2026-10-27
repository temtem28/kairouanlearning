import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';

const CollectionPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('ecom_products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      setCourses(data || []);
      setLoading(false);
    };
    fetchCourses();
  }, [handle]);

  return (
    <div className="min-h-screen bg-forest-950 text-gold-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold text-gold-200 mb-8 capitalize">{handle?.replace(/-/g, ' ')}</h1>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-forest-900 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => <CourseCard key={course.id} product={course} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CollectionPage;
