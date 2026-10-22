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
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  isEnrolled: (productId: string) => Promise<boolean>;
  isAdmin: boolean;
  isCollaborator: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false as false,
  register: async () => false,
  logout: async () => {},
  resetPassword: async () => false,
  updatePassword: async () => false,
  isEnrolled: async () => false,
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
      const msg = error.message?.toLowerCase().includes('confirm')
        ? 'Vérifiez votre boîte mail pour confirmer votre compte avant de vous connecter.'
        : 'Email ou mot de passe incorrect.';
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
      return false;
    }
    const { data: profile } = await supabase
      .from('ecom_customers')
      .select('name, role')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    const role = profile?.role || 'student';
    const u = { email: email.toLowerCase(), name: profile?.name || email.split('@')[0], role };
    setUser(u);
    toast({ title: 'Connexion réussie', description: `Bienvenue, ${u.name} !` });
    return role;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const { error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/connexion`,
        data: { full_name: name },
      },
    });
    if (authError) {
      toast({ title: 'Erreur', description: authError.message, variant: 'destructive' });
      return false;
    }
    // Upsert profile in ecom_customers
    await supabase
      .from('ecom_customers')
      .upsert({ email: email.toLowerCase(), name, role: 'student' }, { onConflict: 'email' });

    toast({ title: 'Inscription réussie', description: 'Vérifiez votre boîte mail pour confirmer votre adresse.' });
    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
      redirectTo: `${window.location.origin}/reinitialiser`,
    });
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Email envoyé', description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.' });
    return true;
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Mot de passe mis à jour', description: 'Votre mot de passe a été modifié avec succès.' });
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
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, updatePassword, isEnrolled, isAdmin, isCollaborator }}>
      {children}
    </AuthContext.Provider>
  );
};
174

<system-reminder>
<total_tokens>14910412 tokens left</total_tokens>
</system-reminder>