import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Lock, ArrowLeft, ShieldCheck, Tag, CreditCard } from 'lucide-react';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripeAccountId = import.meta.env.VITE_STRIPE_ACCOUNT_ID;
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

const stripePromise =
  publishableKey && publishableKey.startsWith('pk_')
    ? loadStripe(publishableKey, stripeAccountId ? { stripeAccount: stripeAccountId } : undefined)
    : null;

function StripePaymentForm({ onSuccess }: { onSuccess: (id: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');
    const { error: err, paymentIntent } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if (err) {
      setError(err.message || 'Erreur de paiement');
      setLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-6 py-4 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-gold-400/20"
      >
        <Lock className="w-4 h-4" />
        {loading ? 'Traitement en cours...' : 'Payer maintenant'}
      </button>
    </form>
  );
}

const elementsAppearance: StripeElementsOptions['appearance'] = {
  theme: 'night',
  variables: {
    colorPrimary: '#d4a843',
    colorBackground: '#0e3e25',
    colorText: '#f0d490',
    colorDanger: '#f87171',
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif',
  },
};

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, subtotalCents, discountCents, couponCode, applyCoupon, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [info, setInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    country: 'Belgique',
  });

  useEffect(() => {
    if (cart.length === 0) navigate('/panier');
  }, [cart.length, navigate]);

  useEffect(() => {
    if (user) {
      setInfo((prev) => ({ ...prev, name: user.name || prev.name, email: user.email || prev.email }));
    }
  }, [user]);

  useEffect(() => {
    if (step !== 'payment' || cartTotal <= 0 || paymentMethod !== 'stripe') {
      setClientSecret('');
      return;
    }
    let cancelled = false;
    setPaymentError('');
    setClientSecret('');
    supabase.functions
      .invoke('create-payment-intent', {
        body: { amount: cartTotal, currency: 'eur', payment_method_types: ['card', 'bancontact'] },
      })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.clientSecret) {
          setPaymentError("Impossible d'initialiser le paiement. Vérifiez la clé Stripe et l'Edge Function.");
        } else {
          setClientSecret(data.clientSecret);
        }
      });
    return () => { cancelled = true; };
  }, [step, cartTotal, paymentMethod]);

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      const { data: customer } = await supabase
        .from('ecom_customers')
        .upsert({ email: info.email.toLowerCase(), name: info.name }, { onConflict: 'email' })
        .select('id')
        .single();

      const { data: order } = await supabase
        .from('ecom_orders')
        .insert({
          customer_id: customer?.id,
          status: 'paid',
          financial_status: 'paid',
          subtotal: subtotalCents,
          tax: 0,
          shipping: 0,
          total_price: cartTotal,
          shipping_address: { ...info, coupon_code: couponCode || undefined, discount_cents: discountCents || 0 },
          stripe_payment_intent_id: paymentId,
        })
        .select('id')
        .single();

      if (order) {
        const orderItems = cart.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          product_name: item.name,
          variant_title: item.variant_title || null,
          sku: item.sku || null,
          quantity: item.quantity,
          unit_price: item.price,
          total: item.price * item.quantity,
        }));
        await supabase.from('ecom_order_items').insert(orderItems);

        for (const item of cart) {
          const { data: prod } = await supabase.from('ecom_products').select('metadata').eq('id', item.product_id).single();
          const days = (prod?.metadata as { access_days?: number } | null)?.access_days;
          const access_expires_at = days && days > 0 ? new Date(Date.now() + days * 86400000).toISOString() : null;
          const enrollmentRow: Record<string, unknown> = {
            user_email: info.email.toLowerCase(),
            product_id: item.product_id,
            order_id: order.id,
            status: 'active',
          };
          if (access_expires_at) enrollmentRow.access_expires_at = access_expires_at;
          await supabase.from('lms_enrollments').upsert(enrollmentRow as never, { onConflict: 'user_email,product_id' });
        }

        await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId: order.id,
            customerEmail: info.email,
            customerName: info.name,
            orderItems,
            subtotal: subtotalCents,
            total: cartTotal,
            couponCode: couponCode || undefined,
            discountCents: discountCents || 0,
          },
        });

        clearCart();
        navigate('/confirmation/' + order.id);
      }
    } catch (err) {
      console.error('Order creation error:', err);
    }
  };

  const elementsOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: elementsAppearance,
    locale: 'fr',
  };

  const handleApplyCoupon = async () => {
    setApplyingCoupon(true);
    await applyCoupon(couponInput);
    setApplyingCoupon(false);
  };

  const inputClass = "w-full px-4 py-3 bg-forest-800 border border-gold-400/15 rounded-xl text-sm text-gold-100 placeholder-gold-100/30 focus:outline-none focus:ring-2 focus:ring-gold-400/40";
  const labelClass = "block text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-forest-950">
      <Header />
      <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/panier" className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium mb-6 hover:text-gold-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour au panier
        </Link>
        <h1 className="font-display text-3xl font-bold text-gold-200 mb-8">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — Info + Payment */}
          <div className="lg:col-span-3 space-y-6">

            {/* Step 1 — Info */}
            <div className="bg-forest-900 rounded-xl p-6 border border-gold-400/10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gold-200">Vos informations</h2>
                {step === 'payment' && (
                  <button type="button" onClick={() => setStep('info')} className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
                    Modifier
                  </button>
                )}
              </div>

              {step === 'info' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Nom complet</label>
                      <input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} className={inputClass} placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} className={inputClass} placeholder="votre@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Adresse</label>
                    <input value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} className={inputClass} placeholder="Rue et numéro" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Ville</label>
                      <input value={info.city} onChange={(e) => setInfo({ ...info, city: e.target.value })} className={inputClass} placeholder="Bruxelles" />
                    </div>
                    <div>
                      <label className={labelClass}>Code postal</label>
                      <input value={info.zip} onChange={(e) => setInfo({ ...info, zip: e.target.value })} className={inputClass} placeholder="1000" />
                    </div>
                    <div>
                      <label className={labelClass}>Pays</label>
                      <input value={info.country} onChange={(e) => setInfo({ ...info, country: e.target.value })} className={inputClass} placeholder="Belgique" />
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="border border-dashed border-gold-400/20 rounded-xl p-4 bg-gold-400/5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gold-400 uppercase tracking-wider mb-3">
                      <Tag className="w-4 h-4" /> Code promo (optionnel)
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Ex. BIENVENUE10"
                        className={`flex-1 min-w-[160px] ${inputClass}`}
                      />
                      <button type="button" onClick={handleApplyCoupon} disabled={applyingCoupon}
                        className="px-4 py-2.5 bg-forest-700 text-gold-200 text-sm font-semibold rounded-xl hover:bg-forest-600 disabled:opacity-50 transition-colors">
                        Appliquer
                      </button>
                      {couponCode && (
                        <button type="button" onClick={removeCoupon} className="px-4 py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors">
                          Retirer
                        </button>
                      )}
                    </div>
                    {couponCode && (
                      <p className="text-xs text-gold-400 mt-2">
                        Code <strong>{couponCode}</strong> appliqué — réduction {(discountCents / 100).toFixed(2)} €
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => { if (info.name && info.email) setStep('payment'); }}
                    disabled={!info.name || !info.email}
                    className="w-full py-4 bg-gold-400 hover:bg-gold-300 text-forest-950 font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-gold-400/20"
                  >
                    Continuer vers le paiement →
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gold-100/60 space-y-1">
                  <p className="font-medium text-gold-200">{info.name}</p>
                  <p>{info.email}</p>
                  {info.address && <p>{info.address}, {info.city} {info.zip}, {info.country}</p>}
                </div>
              )}
            </div>

            {/* Step 2 — Payment */}
            {step === 'payment' && (
              <div className="bg-forest-900 rounded-xl p-6 border border-gold-400/10">
                <h2 className="text-lg font-bold text-gold-200 mb-5">Paiement sécurisé</h2>

                {/* Method tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                      paymentMethod === 'stripe'
                        ? 'bg-gold-400/15 border-gold-400/50 text-gold-300'
                        : 'border-gold-400/15 text-gold-100/50 hover:border-gold-400/30 hover:text-gold-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Carte / Bancontact
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                      paymentMethod === 'paypal'
                        ? 'bg-gold-400/15 border-gold-400/50 text-gold-300'
                        : 'border-gold-400/15 text-gold-100/50 hover:border-gold-400/30 hover:text-gold-200'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                    </svg>
                    PayPal
                  </button>
                </div>

                {/* Stripe */}
                {paymentMethod === 'stripe' && (
                  <>
                    {!stripePromise ? (
                      <div className="bg-gold-400/10 border border-gold-400/25 p-4 rounded-xl">
                        <p className="text-gold-300 text-sm">
                          Définissez <code className="font-mono bg-forest-800 px-1 rounded">VITE_STRIPE_PUBLISHABLE_KEY</code> dans les variables d'environnement Vercel pour activer le paiement.
                        </p>
                      </div>
                    ) : paymentError ? (
                      <div className="bg-red-950/40 border border-red-700/30 p-4 rounded-xl">
                        <p className="text-red-300 text-sm">{paymentError}</p>
                      </div>
                    ) : clientSecret ? (
                      <Elements stripe={stripePromise} options={elementsOptions}>
                        <StripePaymentForm onSuccess={handlePaymentSuccess} />
                      </Elements>
                    ) : (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-gold-400/20 border-t-gold-400 rounded-full" />
                      </div>
                    )}
                    <p className="text-xs text-gold-100/30 mt-3">
                      Bancontact disponible si activé dans votre tableau de bord Stripe (Payment Methods → Bancontact).
                    </p>
                  </>
                )}

                {/* PayPal */}
                {paymentMethod === 'paypal' && (
                  <div>
                    {!paypalClientId ? (
                      <div className="bg-gold-400/10 border border-gold-400/25 p-4 rounded-xl">
                        <p className="text-gold-300 text-sm">
                          Définissez <code className="font-mono bg-forest-800 px-1 rounded">VITE_PAYPAL_CLIENT_ID</code> dans les variables d'environnement Vercel pour activer PayPal.
                        </p>
                      </div>
                    ) : (
                      <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'EUR', locale: 'fr_FR' }}>
                        <PayPalButtons
                          style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                          createOrder={(_data, actions) =>
                            actions.order.create({
                              intent: 'CAPTURE',
                              purchase_units: [{
                                amount: { currency_code: 'EUR', value: (cartTotal / 100).toFixed(2) },
                                description: cart.map(i => i.name).join(', '),
                              }],
                            })
                          }
                          onApprove={async (_data, actions) => {
                            const order = await actions.order!.capture();
                            await handlePaymentSuccess(order.id!);
                          }}
                          onError={(err) => console.error('PayPal error:', err)}
                        />
                      </PayPalScriptProvider>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-5 text-xs text-gold-100/30">
                  <ShieldCheck className="w-4 h-4" />
                  Paiement chiffré SSL — Stripe (conformité PCI DSS)
                </div>
              </div>
            )}
          </div>

          {/* Right — Summary */}
          <div className="lg:col-span-2">
            <div className="bg-forest-900 rounded-xl p-6 border border-gold-400/10 sticky top-24">
              <h2 className="text-lg font-bold text-gold-200 mb-5">Récapitulatif</h2>
              <div className="space-y-3 mb-5">
                {cart.map((item) => (
                  <div key={item.product_id} className="flex gap-3 items-start">
                    {item.image && <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gold-400/10" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gold-200 truncate">{item.name}</p>
                      <p className="text-xs text-gold-100/40">Qté : {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gold-300 flex-shrink-0">
                      {((item.price * item.quantity) / 100).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gold-400/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gold-100/50">
                  <span>Sous-total</span>
                  <span>{(subtotalCents / 100).toFixed(2)} €</span>
                </div>
                {discountCents > 0 && (
                  <div className="flex justify-between text-gold-400">
                    <span>Réduction{couponCode ? ` (${couponCode})` : ''}</span>
                    <span>-{(discountCents / 100).toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-gold-100/50">
                  <span>Livraison</span>
                  <span className="text-gold-400 font-medium">Gratuit</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gold-200 pt-2 border-t border-gold-400/10">
                  <span>Total</span>
                  <span>{(cartTotal / 100).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
