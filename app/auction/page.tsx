'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { placeBid } from '@/app/actions/marketplace'
import { Gavel, Clock, Flame } from 'lucide-react'

export default function Auctions() {
  const supabase = createClient()
  const [auctions, setAuctions] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      const { data } = await supabase
        .from('auctions')
        .select('*, cards(*)')
        .eq('status', 'active')

      if (data) setAuctions(data)
    }

    loadData()

    // Realtime Bidding Listener
    const channel = supabase
      .channel('auctions_realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'auctions' }, (payload) => {
        setAuctions((prev) =>
          prev.map((auc) => (auc.id === payload.new.id ? { ...auc, ...payload.new } : auc))
        )
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleBidSubmit = async (auctionId: string, currentBid: number) => {
    if (!currentUser) return alert('Please sign in to place a bid.')
    const nextBid = currentBid + 25
    const res = await placeBid(auctionId, nextBid, currentUser.id)
    if (!res.success) alert(res.message)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gavel className="text-purple-400" /> Live Card Auctions
        </h1>
        <p className="text-xs text-slate-400 mt-1">Bid in real-time on rare holographic assets.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {auctions.map((item) => (
          <div key={item.id} className="bg-[#0e0a1f] border border-purple-900/30 rounded-2xl overflow-hidden p-4 space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900">
              <img src={item.cards?.image_url} alt={item.cards?.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 right-3 bg-red-950/80 text-red-400 border border-red-800/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Flame size={12} /> Live Bidding
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-200">{item.cards?.title}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock size={12} /> Ends Soon
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-purple-950">
              <div>
                <span className="text-[10px] text-slate-400 block">Current Bid</span>
                <span className="font-extrabold text-purple-400 text-lg">${item.current_bid}</span>
              </div>
              <button
                onClick={() => handleBidSubmit(item.id, item.current_bid)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-purple-600/30"
              >
                Bid +$25
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}