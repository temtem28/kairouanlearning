
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-100/40" />
        <input
          type="text"
          placeholder="Rechercher par client ou ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gold-400/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/40 bg-forest-900"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="bg-forest-900 rounded-xl h-16 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (