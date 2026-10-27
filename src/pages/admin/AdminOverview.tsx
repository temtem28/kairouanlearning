import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { BookOpen, Users, ShoppingBag, TrendingUp, Award, Clock, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        { count: courses },
        { count: students },
        { data: orders },
        { count: enrollments },
        { count: certificates },
        { data: recentEnr },
      ] = await Promise.all([
        supabase.from('ecom_products').select('*', { count: 'exact', head: true }),
        supabase.from('ecom_customers').select('*', { count: 'exact', head: true }),
        supabase.from('ecom_orders').select('total_price, created_at').eq('financial_status', 'paid'),
        supabase.from('lms_enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('lms_certificates').select('*', { count: 'exact', head: true }),
        supabase
          .from('lms_enrollments')
          .select('*, customer:ecom_customers(name, email), product:ecom_products(name)')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      const totalRevenue = (orders || []).reduce((sum: number, o: any) => sum + (o.total_price || 0), 0);

      // Group revenue by month (last 6 months)
      const monthMap: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        monthMap[key] = 0;
      }
      (orders || []).forEach((o: any) => {
        const d = new Date(o.created_at);
        const key = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        if (key in monthMap) monthMap[key] += (o.total_price || 0) / 100;
      });
      setRevenueData(Object.entries(monthMap).map(([name, value]) => ({ name, value })));

      setStats({
        totalCourses: courses || 0,
        totalStudents: students || 0,
        totalOrders: orders?.length || 0,
        totalRevenue,
        totalEnrollments: enrollments || 0,
        totalCertificates: certificates || 0,
      });

      setRecentEnrollments(recentEnr || []);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    { label: 'Cours publiés', value: stats.totalCourses, icon: BookOpen, color: 'emerald', link: '/admin/cours' },
    { label: 'Étudiants', value: stats.totalStudents, icon: Users, color: 'blue', link: '/admin/etudiants' },
    { label: 'Inscriptions', value: stats.totalEnrollments, icon: TrendingUp, color: 'violet', link: '/admin/etudiants' },
    { label: 'Commandes', value: stats.totalOrders, icon: ShoppingBag, color: 'orange', link: '/admin/commandes' },
    {
      label: 'Revenus (€)',
      value: (stats.totalRevenue / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
      icon: TrendingUp,
      color: 'teal',
      link: '/admin/commandes',
    },
    { label: 'Certificats délivrés', value: stats.totalCertificates, icon: Award, color: 'amber', link: '/admin/etudiants' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
    orange: 'bg-orange-50 text-orange-600',
    teal: 'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenue dans votre espace de gestion.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <Link
            key={i}
            to={k.link}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[k.color]}`}>
                <k.icon className="w-4 h-4" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 mt-1">{k.label}</div>
          </Link>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Revenus des 6 derniers mois (€)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v) => [`${Number(v ?? 0).toFixed(2)} €`, 'Revenus']}
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
            <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent enrollments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Inscriptions récentes</h2>
          <Link to="/admin/etudiants" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Voir tout →
          </Link>
        </div>
        {recentEnrollments.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">Aucune inscription pour le moment.</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recentEnrollments.map((e: any) => (
              <li key={e.id} className="flex items-center gap-4 px-6 py-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
                  {(e.customer?.name || e.user_email)?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {e.customer?.name || e.user_email}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{e.product?.name || e.product_id}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(e.created_at).toLocaleDateString('fr-FR')}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
