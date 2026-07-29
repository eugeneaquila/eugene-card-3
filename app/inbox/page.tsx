'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Inbox, Send } from 'lucide-react'

export default function InboxPage() {
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [recipientId, setRecipientId] = useState('')
  const [content, setContent] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    async function loadInbox() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setCurrentUser(user)

      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
    }

    loadInbox()

    // Realtime Listener for new messages
    const channel = supabase
      .channel('messages_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !content || !recipientId) return

    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: recipientId,
      content
    })

    setContent('')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Inbox className="text-purple-400" /> Collector Inbox
        </h1>
        <p className="text-xs text-slate-400 mt-1">Direct encrypted communications with other traders.</p>
      </div>

      <div className="bg-[#0e0a1f] border border-purple-900/30 rounded-2xl h-[450px] flex flex-col justify-between p-4">
        {/* Messages Scroll Area */}
        <div className="overflow-y-auto space-y-3 p-2">
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3.5 py-2 rounded-xl text-xs ${
                  isMe ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={sendMessage} className="mt-4 pt-3 border-t border-purple-950 flex gap-2">
          <input
            type="text"
            placeholder="Recipient User ID..."
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            className="w-1/3 bg-[#07050d] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Type your message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-[#07050d] border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
          />
          <button type="submit" className="p-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white transition">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}