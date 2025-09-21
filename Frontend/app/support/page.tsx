"use client"

import Link from "next/link"
import { MapPin, Mail, Phone, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ChainGo</span>
          </Link>
          <Link href="/">
            <Button variant="outline">Geri Dön</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-14 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Destek & İletişim</h1>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">Sorularınız ve ihtiyaçlarınız için her zaman buradayız. Bize aşağıdaki kanallardan ulaşabilirsiniz.</p>
      </section>

      <main className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <Mail className="h-5 w-5 text-blue-700" />
                <CardTitle>E-posta</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">iletisim@hackstack.com.tr</CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <Phone className="h-5 w-5 text-blue-700" />
                <CardTitle>Telefon</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">+90 535 226 02 45</CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-700" />
                <CardTitle>Adres / Ofis</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">Yenibosna, İstanbul</CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-xl shadow-md border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6022.174420911144!2d28.8229341!3d41.0047771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa3ebbf0e1d6b%3A0xabc!2sYenibosna%2C%20Bahçelievler%2Fİstanbul!5e0!3m2!1str!2str!4v1697814791000!5m2!1str!2str"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">ChainGo</span>
          </div>
          <div className="text-gray-400 text-sm">© 2025 ChainGo. Tüm hakları saklıdır.</div>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <Link href="/privacy" className="hover:text-white">Gizlilik</Link>
            <Link href="/terms" className="hover:text-white">Koşullar</Link>
            <Link href="/support" className="hover:text-white">Destek</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
