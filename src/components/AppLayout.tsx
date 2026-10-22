  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('ecom_products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setCourses(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8d9c0' }}>
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#e8d9c0' }} className="pt-16 lg:pt-18">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">