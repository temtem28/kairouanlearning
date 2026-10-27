import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, BookOpen } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;
    supabase
      .from('ecom_orders')
      .select('*, ecom_order_items(*, ecom_products(title, image_url))')
      .eq('id', orderId)
      .maybeSingle()
      .then(({ data }) => setOrder(data));
  }, [orderId]);

  return (
    <div className="min-h-screen bg-forest-950 text-gold-100">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-serif font-bold text-gold-200 mb-4">Commande confirmée !</h1>
        <p className="text-gold-100/70 mb-8">
          Merci pour votre achat. Votre accès aux cours a été activé.
        </p>
        {order && (
          <div className="bg-forest-900 border border-gold-400/20 rounded-xl p-6 text-left mb-8">
            <p className="text-gold-100/60 text-sm mb-2">Commande #{orderId?.slice(0, 8).toUpperCase()}</p>
            <p className="text-gold-200 font-semibold">
              Total : {(order.total_cents / 100).toFixed(2)} €
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="px-6 py-3 bg-gold-400 text-forest-950 rounded-lg font-semibold hover:bg-gold-300 transition-colors flex items-center gap-2 justify-center">
            <BookOpen className="w-4 h-4" /> Accéder à mes cours
          </Link>
          <Link to="/catalogue" className="px-6 py-3 border border-gold-400/30 text-gold-200 rounded-lg font-semibold hover:bg-forest-800 transition-colors">
            Continuer mes achats
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
