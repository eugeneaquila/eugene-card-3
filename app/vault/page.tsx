'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Vault, ShieldCheck, DollarSign, Layers } from 'lucide-react'

export default function MyVault() {
  const supabase = createClient()
  const [myCards, setMyCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVault() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('user_cards')
          .select('id, acquired_at, cards(*)')
          .eq('user_id', user.id)

        if (!error && data) {
          setMyCards(data)
        }
      }
      setLoading(false)
    }
    fetchVault()
  }, [])

  const totalValue = myCards.reduce((acc, curr) => acc + (curr.cards?.estimated_value || 0), 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Vault className="text-purple-400" /> My Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage your owned assets and inspect vault stats.</p>
        </div>
      </div>

      {/* Quick Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-[#0e0a1f] border border-purple-900/30 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-950/60 rounded-xl border border-purple-800/30 text-purple-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-bold">Total Portfolio Value</p>
            <p className="text-2xl font-black text-white">${totalValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-5 bg-[#0e0a1f] border border-purple-900/30 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-950/60 rounded-xl border border-purple-800/30 text-purple-400">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-bold">Cards Owned</p>
            <p className="text-2xl font-black text-white">{myCards.length}</p>
          </div>
        </div>
      </div>

      {/* Cards Display */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading your vault items...</div>
      ) : myCards.length === 0 ? (
        <div className="text-center py-20 bg-[#0e0a1f]/50 border border-purple-900/20 rounded-2xl">
          <p className="text-slate-400 text-sm font-semibold">Your vault is empty.</p>
          <p className="text-xs text-slate-500 mt-1">Explore the Marketplace to purchase your first card!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myCards.map((item) => (
            <div key={item.id} className="bg-[#0e0a1f] border border-purple-900/30 rounded-2xl overflow-hidden p-4 space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900">
                <img src={item.cards?.image_url} alt={item.cards?.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-200">{item.cards?.title}</h3>
                <span className="text-[10px] text-purple-400 font-semibold">{item.cards?.rarity}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-purple-950">
                <span className="text-slate-400">Est. Value</span>
                <span className="font-bold text-slate-200">${item.cards?.estimated_value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}