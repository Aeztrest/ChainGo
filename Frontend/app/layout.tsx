import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChainGO - MarketPlace',
  description: 'Created with Ezgin Akyurek and Goktug Tunc',
  generator: 'goktugtunc',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
