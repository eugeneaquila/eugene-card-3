'use server'

import { createClient } from '@/lib/supabase/client'
import { revalidatePath } from 'next/cache'

export async function buyCard(listingId: string, cardId: string, price: number, sellerId: string, buyerId: string) {
  const supabase = createClient()

  // 1. Move card ownership in user_cards
  const { error: transferError } = await supabase
    .from('user_cards')
    .insert({ user_id: buyerId, card_id: cardId })

  if (transferError) return { success: false, message: 'Failed to acquire card.' }

  // 2. Mark listing as sold
  await supabase
    .from('listings')
    .update({ status: 'sold' })
    .eq('id', listingId)

  // 3. Log activity for buyer and seller
  await supabase.from('activities').insert([
    {
      user_id: buyerId,
      type: 'purchase',
      description: `Purchased a new card for $${price}`,
      amount: price
    },
    {
      user_id: sellerId,
      type: 'sale',
      description: `Sold card for $${price}`,
      amount: price
    }
  ])

  revalidatePath('/marketplace')
  revalidatePath('/vault')
  return { success: true, message: 'Purchase successful!' }
}

export async function placeBid(auctionId: string, newBidAmount: number, bidderId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('auctions')
    .update({
      current_bid: newBidAmount,
      highest_bidder_id: bidderId
    })
    .eq('id', auctionId)

  if (error) return { success: false, message: 'Failed to place bid.' }

  revalidatePath('/auctions')
  return { success: true, message: 'Bid placed successfully!' }
}

// app/actions/marketplace.ts
'use server'

import { createClient } from '@/lib/supabase/client'
import { sendDiscordAlert } from '@/lib/discord'

export async function createListing(cardId: string, price: number) {
  const supabase = createClient()

  // 1. Fetch card details to get title and rarity
  const { data: card } = await supabase
    .from('cards')
    .select('title, rarity')
    .eq('id', cardId)
    .single()

  // 2. Insert into database
  const { error } = await supabase
    .from('listings')
    .insert({ card_id: cardId, price, status: 'active' })

  if (!error && card) {
    // 3. Trigger Discord notification asynchronously
    await sendDiscordAlert(card.title, price, card.rarity)
  }
}