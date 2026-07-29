// lib/discord.ts

export async function sendDiscordAlert(cardTitle: string, price: number, rarity: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '🔥 RARE CARD LISTING DROPPED!',
          description: `**${cardTitle}** (${rarity}) is now available on the Marketplace for **$${price}**!`,
          color: 0x9333ea, // Purple color matching EUGENE CARD theme
          timestamp: new Date().toISOString(),
        }]
      })
    })
  } catch (error) {
    console.error('Failed to send Discord notification:', error)
  }
}