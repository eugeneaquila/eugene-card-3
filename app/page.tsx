'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, ShoppingBag, Vault, Heart, ArrowLeftRight, 
  Gavel, Inbox, Activity, Users, Shield, Wallet, Layers, ExternalLink
} from 'lucide-react'

export default function OverviewPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    portfolioValue: 0,
    cardsOwned: 0,
    reputation: 0,
    unread: 0,
    trades: 0,
    auctionsWon: 0,
    purchases: 0,
    cardsListed: 0,
    totalSpending: 0
  })

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch vault stats
        const { data: vaultData } = await supabase
          .from('vault_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        // Fetch owned cards count
        const { count: cardsCount } = await supabase
          .from('user_cards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        // Fetch unread messages
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('is_read', false)

        if (vaultData) {
          setStats({
            portfolioValue: vaultData.portfolio_value || 0,
            cardsOwned: cardsCount || 0,
            reputation: vaultData.reputation_score || 0,
            unread: unreadCount || 0,
            trades: vaultData.trades_completed || 0,
            auctionsWon: vaultData.auctions_won || 0,
            purchases: vaultData.purchases_count || 0,
            cardsListed: vaultData.cards_listed || 0,
            totalSpending: vaultData.total_spending || 0
          })
        }
      }
      setLoading(false)
    }

    loadDashboardData()
  }, [])

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="flex h-screen bg-[#07050d] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-purple-900/20 bg-[#0a0714] flex flex-col justify-between p-4">
        <div>
          {/* Main Logo */}
          <div className="flex items-center gap-3 px-2 py-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <span className="text-xl font-bold text-purple-400">2</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wider">EUGENE CARD</h1>
              <p className="text-[10px] text-purple-400 tracking-widest">COLLECT • TRADE • OWN</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-6">
            <p className="text-[10px] text-purple-300/40 font-semibold uppercase px-3 mb-2">Workspace</p>
            <nav className="space-y-1">
              <Link href="/"><NavItem icon={<LayoutDashboard size={18} />} label="Overview" active /></Link>
              <Link href="/marketplace"><NavItem icon={<ShoppingBag size={18} />} label="Marketplace" /></Link>
              <Link href="/vault"><NavItem icon={<Vault size={18} />} label="My Vault" /></Link>
              <Link href="/trading"><NavItem icon={<ArrowLeftRight size={18} />} label="Trading" /></Link>
              <Link href="/auctions"><NavItem icon={<Gavel size={18} />} label="Auctions" /></Link>
              <Link href="/inbox"><NavItem icon={<Inbox size={18} />} label="Inbox" badge={stats.unread} /></Link>
              <Link href="/activity"><NavItem icon={<Activity size={18} />} label="Activity" /></Link>
            </nav>
          </div>
        </div>

        {/* Sidebar Auth / Footer */}
        <div className="space-y-4">
          <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-800/20">
            <p className="text-xs text-purple-400 font-semibold">Authentication</p>
            {!user ? (
              <button 
                onClick={handleGoogleLogin}
                className="mt-2 w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Login with Google</span>
              </button>
            ) : (
              <p className="text-xs text-slate-300 mt-1 truncate">{user.email}</p>
            )}
          </div>

          <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-800/20">
            <p className="text-xs font-bold text-slate-200">EUGENE CARD 3.0</p>
            <p className="text-[11px] text-slate-400 mt-1">Next-gen marketplace for collectors worldwide.</p>
          </div>
        </div>
      </aside>

      {/* Main Tab Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0c081a] via-[#07050d] to-[#120720]">
        <header className="h-16 border-b border-purple-900/20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">EUGENE CARD</span>
            <span className="text-[10px] bg-purple-900/50 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">Beta Edition</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>🌐 EN</span>
            <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs text-purple-200 font-semibold">
              {user?.email?.slice(0, 2).toUpperCase() || 'YU'}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl mx-auto">
          {/* Banner */}
          <div className="relative rounded-2xl p-8 overflow-hidden bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-transparent border border-purple-800/30 flex justify-between items-center">
            <div className="max-w-md z-10">
              <span className="text-xs font-semibold text-purple-400 tracking-wider">EUGENE CARD 3.0</span>
              <h2 className="text-3xl font-extrabold mt-1">Your <span className="text-purple-400">collection</span>, at a glance.</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                A unified command surface for your cards, market activity, conversations and collector progress.
              </p>
              <div className="flex gap-3 mt-4">
                <Link href="/marketplace">
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg transition shadow-md shadow-purple-600/30">Browse Market</button>
                </Link>
                <Link href="/inbox">
                  <button className="px-4 py-2 bg-purple-950/40 border border-purple-700/30 hover:bg-purple-900/30 text-white font-semibold text-xs rounded-lg transition">Open Inbox</button>
                </Link>
              </div>
            </div>

            {/* Hologram Graphic */}
            <div className="relative w-64 h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
              <div className="w-32 h-44 bg-gradient-to-tr from-purple-700 via-indigo-500 to-purple-400 rounded-xl border border-purple-300/40 shadow-[0_0_30px_rgba(168,85,247,0.4)] transform -rotate-6 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white drop-shadow-md">2</span>
              </div>
            </div>
          </div>

          {/* Collector Welcome & Level */}
          <div className="p-6 rounded-2xl bg-[#0e0a1f] border border-purple-900/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Collector Dashboard</span>
              <h3 className="text-xl font-bold mt-1">Welcome back! 👋</h3>
              <p className="text-xs text-slate-400 mt-0.5">Track your collection, discover new cards and keep your trades moving.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase">Collector Level</span>
              <div className="text-2xl font-black text-purple-300">Lv. 1</div>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="w-1/4 h-full bg-purple-500"></div>
              </div>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="PORTFOLIO VALUE" value={`$${stats.portfolioValue}`} subtext="Estimated current card value" icon={<Wallet className="text-purple-400" size={20} />} />
            <MetricCard title="CARDS OWNED" value={stats.cardsOwned} subtext="Cards in your vault" icon={<Layers className="text-purple-400" size={20} />} />
            <MetricCard title="REPUTATION" value={stats.reputation} subtext="Server-authoritative score" icon={<Shield className="text-purple-400" size={20} />} />
            <MetricCard title="UNREAD" value={stats.unread} subtext="Conversations needing attention" icon={<Inbox className="text-purple-400" size={20} />} />
          </div>

          {/* Quick Actions & Snapshot Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0e0a1f] border border-purple-900/20">
              <h4 className="font-bold text-sm">Quick actions</h4>
              <p className="text-xs text-slate-400 mb-4">Everything important is one click away.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/marketplace"><ActionCard title="Explore Marketplace" desc="Browse cards, pricing and availability." icon={<ShoppingBag size={20} />} /></Link>
                <Link href="/vault"><ActionCard title="Open My Vault" desc="See your owned cards and portfolio." icon={<Vault size={20} />} /></Link>
                <Link href="/trading"><ActionCard title="Start a Trade" desc="Send, receive and manage your trades." icon={<ArrowLeftRight size={20} />} /></Link>
                <Link href="/auctions"><ActionCard title="View Auctions" desc="Discover live auctions and place bids." icon={<Gavel size={20} />} /></Link>
              </div>
            </div>

            {/* Collector Snapshot */}
            <div className="p-6 rounded-2xl bg-[#0e0a1f] border border-purple-900/20">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold text-sm">Collector snapshot</h4>
                  <p className="text-[11px] text-slate-400">Your current server-backed progress.</p>
                </div>
                <Link href="/activity">
                  <button className="text-[11px] bg-purple-950/60 border border-purple-800/40 hover:bg-purple-900/40 px-2.5 py-1 rounded-lg transition flex items-center gap-1">
                    View Activity <ExternalLink size={10} />
                  </button>
                </Link>
              </div>
              <div className="space-y-2 text-xs">
                <SnapshotRow label="Completed trades" value={stats.trades} />
                <SnapshotRow label="Auction wins" value={stats.auctionsWon} />
                <SnapshotRow label="Purchases" value={stats.purchases} />
                <SnapshotRow label="Cards listed" value={stats.cardsListed} />
                <SnapshotRow label="Total spending" value={`$${stats.totalSpending}`} highlight />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active, badge }: any) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${active ? 'bg-purple-900/40 text-purple-200 border border-purple-700/30' : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{badge}</span>
      )}
    </div>
  )
}

function MetricCard({ title, value, subtext, icon }: any) {
  return (
    <div className="p-4 rounded-xl bg-[#0e0a1f] border border-purple-900/20 flex gap-4 items-start">
      <div className="p-2.5 bg-purple-950/60 border border-purple-800/30 rounded-xl">{icon}</div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{title}</p>
        <p className="text-xl font-extrabold text-white my-0.5">{value}</p>
        <p className="text-[10px] text-slate-400">{subtext}</p>
      </div>
    </div>
  )
}

function ActionCard({ title, desc, icon }: any) {
  return (
    <div className="p-3 bg-purple-950/20 border border-purple-900/30 hover:border-purple-600/50 rounded-xl transition cursor-pointer group h-full">
      <div className="p-2 w-fit bg-purple-900/30 rounded-lg text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">{icon}</div>
      <p className="text-xs font-bold mt-2 text-slate-200">{title}</p>
      <p className="text-[10px] text-slate-400 mt-1 leading-snug">{desc}</p>
    </div>
  )
}

function SnapshotRow({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between py-1 border-b border-purple-950 text-slate-300">
      <span className="text-slate-400">{label}</span>
      <span className={highlight ? 'font-bold text-purple-400' : 'font-semibold'}>{value}</span>
    </div>
  )
}