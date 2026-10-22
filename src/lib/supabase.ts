import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://nvubddzcjjlcuwqhltsd.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dWJkZHpjampsY3V3cWhsdHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTk3NzYsImV4cCI6MjA5NjIzNTc3Nn0.yjldyaHjWuM2LGvI-2RUVQrs87J0ZmwqmOEYBixp92U';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
