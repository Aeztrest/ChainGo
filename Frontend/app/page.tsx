"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Wallet, Shield, Users, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { checkAuthStatus, logout, type User as AuthUser } from "@/lib/auth"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const authStatus = await checkAuthStatus()

      setIsAuthenticated(authStatus.isAuthenticated)
      setUser(authStatus.user || null)

      console.log("🔐 Ana sayfa auth durumu:", authStatus.isAuthenticated)
    } catch (error) {
      console.error("❌ Auth kontrolü hatası:", error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
    setUser(null)
    console.log("👋 Kullanıcı çıkış yaptı")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ChainGo</span>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : isAuthenticated && user ? (
                <>
                  <span className="text-sm text-gray-600">Merhaba, {user.username}</span>
                  <Button variant="outline" size="icon" onClick={handleProfile}>
                    <User className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                  <Link href="/products">
                    <Button>Ürünlere Git</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Giriş Yap</Button>
                  </Link>
                  <Link href="/login">
                    <Button>Başla</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Web3 ile Güvenli
            <span className="text-blue-600"> İkinci El </span>
            Alışveriş
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Blockchain teknolojisi ile güvenli, şeffaf ve merkezi olmayan bir ikinci el eşya pazarı. Wallet'ınızla
            bağlanın ve güvenle alışveriş yapın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Ürünleri Keşfet
                  </Button>
                </Link>
                <Link href="/create-listing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    İlan Ver
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Wallet className="mr-2 h-5 w-5" />
                    Wallet ile Bağlan
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    Ürünleri Keşfet
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Neden ChainGo?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Güvenli İşlemler</CardTitle>
                <CardDescription>Blockchain teknolojisi ile tüm işlemleriniz güvende ve şeffaf</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Wallet className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Kolay Ödeme</CardTitle>
                <CardDescription>Wallet'ınızla hızlı ve güvenli ödemeler yapın</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Güvenilir Topluluk</CardTitle>
                <CardDescription>Doğrulanmış kullanıcılarla güvenle alışveriş yapın</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xl font-bold">ChainGo</span>
            </div>
            <p className="text-gray-400">© 2024 ChainGo. Web3 ile güvenli alışveriş.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
