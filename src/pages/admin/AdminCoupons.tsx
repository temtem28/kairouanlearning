          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gold-100/70 mb-1">Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="PROMO20"
                className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-gold-400/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gold-100/70 mb-1">Réduction (%)</label>
                <input
                  type="number" min={0} max={100}
                  value={form.percent_off}
                  onChange={e => setForm(p => ({ ...p, percent_off: e.target.value, amount_off: '' }))}
                  placeholder="20"
                  className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gold-100/70 mb-1">Montant (�?�)</label>
                <input
                  type="number" min={0} step={0.01}
                  value={form.amount_off}
                  onChange={e => setForm(p => ({ ...p, amount_off: e.target.value, percent_off: '' }))}
                  placeholder="10.00"
                  className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gold-100/70 mb-1">Expiration (optionnel)</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gold-400/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
                className="accent-emerald-600"
              />
              <span className="text-sm text-gold-100/70">Activer immédiatement</span>
            </label>
          </div>
          <DialogFooter>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gold-100/60">Annuler</button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-gold-400 text-white rounded-lg text-sm font-medium hover:bg-forest-700 disabled:opacity-50"
            >
              {creating ? 'Création...' : 'Créer'}