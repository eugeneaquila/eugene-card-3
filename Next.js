useEffect(() => {
  const subscription = supabase
    .channel('auction-updates')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids' }, (payload) => {
      // Update auction state live
    })
    .subscribe()

  return () => { supabase.removeChannel(subscription) }
}, [])

import Link from 'next/link'

// Wrap your sidebar items in Next.js Link components:
<Link href="/marketplace"><NavItem icon={<ShoppingBag size={18} />} label="Marketplace" /></Link>
<Link href="/vault"><NavItem icon={<Vault size={18} />} label="My Vault" /></Link>
<Link href="/trading"><NavItem icon={<ArrowLeftRight size={18} />} label="Trading" /></Link>
<Link href="/auctions"><NavItem icon={<Gavel size={18} />} label="Auctions" /></Link>
<Link href="/inbox"><NavItem icon={<Inbox size={18} />} label="Inbox" /></Link>
<Link href="/activity"><NavItem icon={<Activity size={18} />} label="Activity" /></Link>

const uploadCardImage = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('card-images')
    .upload(`${Date.now()}-${file.name}`, file)

  if (data) {
    const publicUrl = supabase.storage.from('card-images').getPublicUrl(data.path).data.publicUrl
    return publicUrl
  }
}