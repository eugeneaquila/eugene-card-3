import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EUGENE CARD 3.0',
  description: 'Next-gen marketplace for collectors worldwide',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#07050d] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  )
}