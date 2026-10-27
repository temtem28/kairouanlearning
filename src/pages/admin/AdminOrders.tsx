import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  paid: { label: 'Payé', cls: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'En attente', cls: 'bg-yellow-100 text-yellow-700' },
  refunded: { label: 'Remboursé', cls: 'bg-red-100 text-red-600' },
  failed: { label: 'Échoué', cls: 'bg-gray-100 text-gray-500' },
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ecom_orders')
      .select('*, customer:ecom_customers(name, email), items:ecom_order_items(*, product:ecom_products(name))')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const filtered = orders.filter(o => {
    const name = o.customer?.name || o.customer_email || '';
    const email = o.customer?.email || o.customer_email || '';
    return !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase());
  });

  const total = orders
    .filter(o => o.financial_status === 'paid')
    .reduce((sum, o) => sum + (o.total_price || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {orders.length} commande{orders.length !== 1 ? 's' : ''} · Revenu total :{' '}
            <span className="font-semibold text-gray-700">{(total / 100).toFixed(2)} €</span>
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par client ou ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl h-16 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
                <th className="hidden md:table-cell text-left px-4 py-3 font-medium text-gray-500">Date</th>
                <th className="hidden sm:table-cell text-right px-4 py-3 font-medium text-gray-500">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => {
                const st = STATUS_LABELS[order.financial_status] || STATUS_LABELS.pending;
                const isOpen = expandedId === order.id;
                return (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{order.customer?.name || order.customer_email}</p>
                        <p className="text-xs text-gray-400 font-mono">{order.id?.slice(0, 8)}…</p>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-right font-semibold text-gray-900">
                        {order.total_price ? `${(order.total_price / 100).toFixed(2)} €` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedId(isOpen ? null : order.id)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors"
                        >
                          {isOpen
                            ? <ChevronUp className="w-4 h-4 text-gray-400" />
                            : <ChevronDown className="w-4 h-4 text-gray-400" />
                          }
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-4 py-3">
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Lignes de commande</p>
                            {(order.items || []).map((item: any, i: number) => (
                              <div key={i} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2 border border-gray-100">
                                <span className="text-gray-700">{item.product?.name || item.product_id}</span>
                                <div className="flex items-center gap-4 text-gray-500">
                                  <span>×{item.quantity}</span>
                                  <span className="font-medium text-gray-900">
                                    {item.price ? `${(item.price / 100).toFixed(2)} €` : '—'}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {order.discount_amount > 0 && (
                              <div className="flex justify-between text-sm px-3 py-1 text-emerald-700">
                                <span>Réduction ({order.coupon_code})</span>
                                <span>-{(order.discount_amount / 100).toFixed(2)} €</span>
                              </div>
                            )}
                            {order.shipping_address && (
                              <div className="mt-2 text-xs text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-100">
                                <span className="font-medium">Adresse :</span>{' '}
                                {[
                                  order.shipping_address.first_name,
                                  order.shipping_address.last_name,
                                  order.shipping_address.address1,
                                  order.shipping_address.city,
                                  order.shipping_address.country,
                                ].filter(Boolean).join(', ')}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
