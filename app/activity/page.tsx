'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Activity, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'

export default function ActivityStream() {
  const supabase = createClient()
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    async function fetchActivities() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (data) setActivities(data)
      }
    }
    fetchActivities()
  }, [])

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="text-purple-400" /> Account Activity
        </h1>
        <p className="text-xs text-slate-400 mt-1">Audit trail of purchases, sales, and vault updates.</p>
      </div>

      <div className="bg-[#0e0a1f] border border-purple-900/30 rounded-2xl divide-y divide-purple-950 overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No account activity recorded yet.</div>
        ) : (
          activities.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-purple-950/20 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-900/30 border border-purple-700/30 rounded-lg text-purple-400">
                  {item.type === 'purchase' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{item.description}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              </div>
              <span className={`text-xs font-bold ${item.type === 'sale' ? 'text-emerald-400' : 'text-purple-300'}`}>
                {item.amount > 0 ? `$${item.amount}` : '-'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}