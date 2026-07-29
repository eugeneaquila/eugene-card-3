useEffect(() => {
  const subscription = supabase
    .channel('auction-updates')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids' }, (payload) => {
      // Update auction state live
    })
    .subscribe()

  return () => { supabase.removeChannel(subscription) }
}, [])