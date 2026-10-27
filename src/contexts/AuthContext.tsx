import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface User {
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | false>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isEnrolled: (productId: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  isAdmin: boolean;
  isCollaborator: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  isEnrolled: async () => false,
  resetPassword: async () => false,
  updatePassword: async () => false,
  isAdmin: false,
  isCollaborator: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (email: string) => {
    const { data } = await supabase
      .from('ecom_customers')
      .select('name, role')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    setUser({
      email: email.toLowerCase(),
      name: data?.name || email.split('@')[0],
      role: data?.role || 'student',
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        loadProfile(session.user.email).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        loadProfile(session.user.email);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const login = async (email: string, password: string): Promise<string | false> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });
    if (error) {
      toast({ title: 'Erreur', description: 'Email ou mot de passe incorrect.', variant: 'destructive' });
      return false;
    }
    toast({ title: 'Connexion réussie', description: 'Bienvenue !' });
    return 'student';
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Email envoyé', description: 'Vérifiez votre boîte mail.' });
    return true;
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Mot de passe mis à jour', description: 'Votre mot de passe a été modifié.' });
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const { error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });
    if (authError) {
      toast({ title: 'Erreur', description: authError.message, variant: 'destructive' });
      return false;
    }
    // Upsert profile in ecom_customers
    await supabase
      .from('ecom_customers')
      .upsert({ email: email.toLowerCase(), name, role: 'student' }, { onConflict: 'email' });

    toast({ title: 'Inscription réussie', description: `Bienvenue, ${name} !` });
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({ title: 'Déconnexion', description: 'À bientôt !' });
  };

  const isEnrolled = async (productId: string): Promise<boolean> => {
    if (!user) return false;
    const { data } = await supabase
      .from('lms_enrollments')
      .select('id, access_expires_at')
      .eq('user_email', user.email)
      .eq('product_id', productId)
      .eq('status', 'active')
      .maybeSingle();
    if (!data) return false;
    const exp = (data as { access_expires_at?: string | null }).access_expires_at;
    if (exp && new Date(exp) <= new Date()) return false;
    return true;
  };

  const isAdmin = user?.role === 'admin';
  const isCollaborator = user?.role === 'collaborator' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isEnrolled, resetPassword, updatePassword, isAdmin, isCollaborator }}>
      {children}
    </AuthContext.Provider>
  );
};
