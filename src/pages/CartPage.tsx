import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, subtotalCents, discountCents, couponCode, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-forest-950">
        <Header />
        <div className="pt-32 pb-20 text-center max-w-lg mx-auto px-4">
          <div className="w-20 h-20 bg-forest-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-gold-100/30" />
          </div>
          <h1 className="text-2xl font-bold text-gold-200 mb-3">Votre panier est vide</h1>
          <p className="text-gold-100/50 mb-8">{"Découvrez nos cours et commencez votre apprentissage dès aujourd'hui."}</p>
          <Link to="/catalogue" className="inline-flex items-center gap-2 px-6 py-3 bg-forest-700 text-white font-semibold rounded-xl hover:bg-forest-800 transition-colors">
            Explorer les cours
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const fmt = (cents: number) => `${(cents / 100).toFixed(2)} €`;

  return (
    <div className="min-h-screen bg-forest-950">
      <Header />
      <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/catalogue" className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Continuer les achats
        </Link>
        <h1 className="text-3xl font-bold text-gold-200 mb-8">Votre panier ({cartCount})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.product_id + (item.variant_id || '')} className="bg-forest-900 rounded-xl p-5 shadow-sm border border-gold-400/10 flex gap-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gold-200 truncate">{item.name}</h3>
                  {item.variant_title && <p className="text-sm text-gold-100/50">{item.variant_title}</p>}
                  <p className="text-lg font-bold text-gold-400 mt-1">{fmt(item.price)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gold-400/15 rounded-lg">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)} className="p-1.5 hover:bg-forest-950">
                        <Minus className="w-4 h-4 text-gold-100/50" />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)} className="p-1.5 hover:bg-forest-950">
                        <Plus className="w-4 h-4 text-gold-100/50" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.product_id, item.variant_id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right font-bold text-gold-200">
                  {fmt(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-forest-900 rounded-xl p-6 shadow-sm border border-gold-400/10 h-fit sticky top-24">
            <h2 className="text-lg font-bold text-gold-200 mb-4">{"Résumé"}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gold-100/60">
                <span>Sous-total</span>
                <span>{fmt(subtotalCents)}</span>
              </div>
              {discountCents > 0 && (
                <div className="flex justify-between text-gold-400">
                  <span>{`Réduction${couponCode ? ` (${couponCode})` : ''}`}</span>
                  <span>-{fmt(discountCents)}</span>
                </div>
              )}
              <div className="flex justify-between text-gold-100/60">
                <span>Livraison</span>
                <span className="text-gold-400 font-medium">Gratuit</span>
              </div>
              <hr className="border-gold-400/15" />
              <div className="flex justify-between text-lg font-bold text-gold-200">
                <span>Total</span>
                <span>{fmt(cartTotal)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 py-4 bg-forest-700 text-white font-semibold rounded-xl hover:bg-forest-800 transition-colors shadow-lg shadow-emerald-200"
            >
              {"Procéder au paiement"}
            </button>
            <p className="text-xs text-gold-100/40 text-center mt-3">{"Paiement sécurisé (Stripe : cartes, Bancontact, etc.)"}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
