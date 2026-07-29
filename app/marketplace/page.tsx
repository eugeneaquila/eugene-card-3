'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShoppingBag, Search, Tag, Filter } from 'lucide-react'

export default function Marketplace() {
  const supabase = createClient()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          price,
          cards ( id, title, image_url, rarity, estimated_value ),
          profiles:seller_id ( username )
        `)
        .eq('status', 'active')

      if (!error && data) {
        setListings(data)
      }
      setLoading(false)
    }
    fetchListings()
  }, [])

  const filteredListings = filter === 'All' 
    ? listings 
    : listings.filter(item => item.cards?.rarity === filter)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-purple-400" /> Card Marketplace
          </h1>
          <p className="text-xs text-slate-400 mt-1">Discover, buy, and collect verified cards from other players.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#0e0a1f] p-1 rounded-xl border border-purple-900/30 gap-1">
          {['All', 'Legendary', 'Epic', 'Rare'].map((rarity) => (
            <button
              key={rarity}
              onClick={() => setFilter(rarity)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === rarity 
                  ? 'bg-purple-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading market listings...</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-sm">No listings found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
            <div key={item.id} className="bg-[#0e0a1f] border border-purple-900/30 hover:border-purple-500/50 rounded-2xl overflow-hidden transition group">
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <img 
                  src={item.cards?.image_url} 
                  alt={item.cards?.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  {item.cards?.rarity}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-200">{item.cards?.title}</h3>
                  <p className="text-[11px] text-slate-400">Seller: {item.profiles?.username || 'Anonymous'}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-purple-950">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Price</span>
                    <span className="font-extrabold text-purple-400">${item.price}</span>
                  </div>
                  <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition shadow-md shadow-purple-600/20">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}