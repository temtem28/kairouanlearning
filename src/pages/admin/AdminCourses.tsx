  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    handle: '',
    description: '',
    price: '',
    compare_at_price: '',
    stripe_payment_url: '',
    product_type: 'Cours',
    status: 'draft',
    instructor: '',
    level: 'Débutant',
  });

  useEffect(() => {
    fetchCourses();
  }, []);