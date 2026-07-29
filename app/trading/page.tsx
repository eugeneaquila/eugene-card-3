'use client'

import React, { useState } from 'react'
import { ArrowLeftRight, Send } from 'lucide-react'

export default function Trading() {
  const [receiverId, setReceiverId] = useState('')
  const [offeredCardId, setOfferedCardId] = useState('')
  const [requestedCardId, setRequestedCardId] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMsg('Trade proposal sent successfully!')
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ArrowLeftRight className="text-purple-400" /> Start a Trade
        </h1>
        <p className="text-xs text-slate-400 mt-1">Propose direct peer-to-peer card swaps with other collectors.</p>
      </div>

      <form onSubmit={handleTrade} className="bg-[#0e0a1f] p-6 rounded-2xl border border-purple-900/30 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Target Collector User ID</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" 
            className="w-full bg-[#07050d] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Offered Card ID</label>
            <input 
              type="text" 
              required
              placeholder="Select card from vault..." 
              className="w-full bg-[#07050d] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              value={offeredCardId}
              onChange={(e) => setOfferedCardId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Requested Card ID</label>
            <input 
              type="text" 
              required
              placeholder="Card ID you want..." 
              className="w-full bg-[#07050d] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              value={requestedCardId}
              onChange={(e) => setRequestedCardId(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
        >
          <Send size={16} /> Send Trade Proposal
        </button>

        {statusMsg && (
          <p className="text-xs text-emerald-400 text-center font-medium mt-2">{statusMsg}</p>
        )}
      </form>
    </div>
  )
}