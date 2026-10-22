
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