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