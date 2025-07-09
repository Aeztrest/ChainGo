"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, ArrowLeft, User, Wallet, Package, Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import { getFavoriteCount } from "@/lib/favorites"
import { requireAuth, logout, type User as AuthUser } from "@/lib/auth"
import { checkStacksConnection, getLocalStorage } from "@stacks/connect"

interface UserInfo {
  name?: string
  username: string
  wallet_address?: string
  wallet?: string
  created_at?: string
  user_id?: number
}

interface StacksUserData {
  addresses: {
    stx: Array<{ address: string }>
    btc: Array<{ address: string }>
  }
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [stacksUserData, setStacksUserData] = useState<StacksUserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      setIsAuthLoading(true)
      const authStatus = await requireAuth()

      if (!authStatus.isAuthenticated) {
        router.push("/login")
        return
      }

      setUser(authStatus.user || null)
      console.log("🔐 Profil sayfası auth durumu:", authStatus.isAuthenticated)
      console.log("👤 Auth user bilgisi:", authStatus.user)

      // Auth başarılıysa profil verilerini yükle
      loadProfileData()
    } catch (error) {
      console.error("❌ Auth kontrolü hatası:", error)
      router.push("/login")
    } finally {
      setIsAuthLoading(false)
    }
  }

  const loadProfileData = () => {
    try {
      setIsLoading(true)
      console.log("📤 Profil verileri yükleniyor...")

      // Backend'den gelen kullanıcı bilgilerini al
      const savedUserInfo = localStorage.getItem("user_info")
      console.log("💾 localStorage user_info:", savedUserInfo)

      if (savedUserInfo) {
        const backendUser = JSON.parse(savedUserInfo)
        console.log("👤 Backend kullanıcı bilgileri:", backendUser)
        setUserInfo(backendUser)
      }

      // Stacks kullanıcı verilerini al
      const stacksData = localStorage.getItem("stacks_user_data")
      console.log("💾 localStorage stacks_user_data:", stacksData)

      if (stacksData) {
        const stacksUser = JSON.parse(stacksData)
        console.log("🔗 Stacks kullanıcı verileri:", stacksUser)
        setStacksUserData(stacksUser)
      } else {
        // localStorage'da yoksa Stacks Connect'ten al
        console.log("🔍 Stacks Connect'ten kullanıcı verileri alınıyor...")
        const stacksConnected = checkStacksConnection()

        if (stacksConnected) {
          const stacksUser = getLocalStorage()
          console.log("🔗 Stacks Connect'ten alınan veriler:", stacksUser)

          if (stacksUser) {
            setStacksUserData(stacksUser)
            // localStorage'a da kaydet
            localStorage.setItem("stacks_user_data", JSON.stringify(stacksUser))
          }
        }
      }

      // Favori sayısını yükle
      const favCount = getFavoriteCount()
      setFavoriteCount(favCount)
      console.log("❤️ Favori sayısı:", favCount)
    } catch (error) {
      console.error("❌ Profil verileri yüklenirken hata:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Kullanıcı adını al (backend'den veya Stacks'ten)
  const getUserName = (): string => {
    if (userInfo?.name) {
      return userInfo.name
    }
    if (userInfo?.username) {
      return userInfo.username
    }
    if (user?.username) {
      return user.username
    }
    return "Kullanıcı"
  }

  // Kullanıcı username'ini al
  const getUserUsername = (): string => {
    if (userInfo?.username) {
      return userInfo.username
    }
    if (user?.username) {
      return user.username
    }
    return "username"
  }

  // Wallet adresini al (Stacks'ten veya backend'den)
  const getWalletAddress = (): string => {
    // Önce Stacks verilerinden STX adresini al
    if (stacksUserData?.addresses?.stx?.[0]?.address) {
      return stacksUserData.addresses.stx[0].address
    }

    // Sonra backend'den gelen wallet bilgisini kontrol et
    if (userInfo?.wallet_address) {
      return userInfo.wallet_address
    }

    if (userInfo?.wallet) {
      return userInfo.wallet
    }

    if (user?.wallet) {
      return user.wallet
    }

    // localStorage'dan STX adresini al
    const stxAddress = localStorage.getItem("stacks_address")
    if (stxAddress) {
      return stxAddress
    }

    return "Wallet adresi bulunamadı"
  }

  // Üyelik tarihini al
  const getMembershipDate = (): string => {
    if (userInfo?.created_at) {
      return new Date(userInfo.created_at).toLocaleDateString("tr-TR")
    }
    return "Bilinmiyor"
  }

  // Auth yüklenirken loading göster
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Profil yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ürünlere Dön
              </Link>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">ChainGo</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Merhaba, {userInfo?.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sol Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle>{getUserName()}</CardTitle>
                <CardDescription>@{getUserUsername()}</CardDescription>
                <Badge variant="secondary" className="w-fit mx-auto mt-2">
                  ✓ Doğrulanmış Kullanıcı
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Üyelik Tarihi</span>
                  <span>{getMembershipDate()}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => router.push("/my-listings")}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    İlanlarım
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => router.push("/favorites")}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Favorilerim
                    {favoriteCount > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {favoriteCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ana İçerik */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profil Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>Kişisel bilgilerinizi görüntüleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <div className="p-3 bg-gray-50 rounded-lg h-12 flex items-center">{getUserName()}</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Kullanıcı Adı</Label>
                    <div className="p-3 bg-gray-50 rounded-lg h-12 flex items-center">@{getUserUsername()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Stacks Wallet Bilgileri
                </CardTitle>
                <CardDescription>Stacks blockchain wallet adresiniz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>STX Wallet Adresi</Label>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <code className="text-sm break-all">{getWalletAddress()}</code>
                  </div>
                  <p className="text-xs text-gray-500">
                    Bu adres Stacks blockchain üzerindeki wallet adresinizdir ve değiştirilemez.
                  </p>
                </div>

                {/* BTC Adresi varsa göster */}
                {stacksUserData?.addresses?.btc?.[0]?.address && (
                  <div className="space-y-2">
                    <Label>BTC Wallet Adresi</Label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <code className="text-sm break-all">{stacksUserData.addresses.btc[0].address}</code>
                    </div>
                    <p className="text-xs text-gray-500">Bitcoin wallet adresiniz (Stacks Connect üzerinden).</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* İstatistikler */}
            <Card>
              <CardHeader>
                <CardTitle>Hesap İstatistikleri</CardTitle>
                <CardDescription>Platform kullanım bilgileriniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600 mt-1">Aktif İlan</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600 mt-1">Tamamlanan Satış</div>
                  </div>
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">{favoriteCount}</div>
                    <div className="text-sm text-gray-600 mt-1">Favori</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
