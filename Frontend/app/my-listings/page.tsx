"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ShoppingBag, ArrowLeft, Trash2, Eye, MapPin, Calendar, Loader2, Plus, Package } from "lucide-react"
import Link from "next/link"

interface UserListing {
  id: number
  title: string
  description: string
  price: string
  category: string
  username: string
  images: string[]
  created_at: string
  is_sold: boolean
  buyer_username: string | null
  sold_at: string | null
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<UserListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // JWT token kontrolü
    const token = localStorage.getItem("jwt_token")
    if (!token) {
      router.push("/login")
      return
    }

    // Kullanıcı bilgilerini yükle
    const savedUserInfo = localStorage.getItem("user_info")
    if (savedUserInfo) {
      const user = JSON.parse(savedUserInfo)
      setUserInfo(user)
      fetchUserListings(user.username)
    } else {
      router.push("/login")
    }
  }, [router])

  const fetchUserListings = async (username: string) => {
    try {
      setIsLoading(true)
      console.log(`📤 ${username} kullanıcısının ilanları getiriliyor...`)

      const response = await fetch(
        `https://hackback.hackstack.com.tr/get_user_listings?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      console.log("📥 API yanıtı:", response.status, response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Kullanıcı ilanları alındı:", data)

        // Veri formatını kontrol et ve array olduğundan emin ol
        if (Array.isArray(data)) {
          setListings(data)
        } else if (data.listings && Array.isArray(data.listings)) {
          setListings(data.listings)
        } else {
          console.warn("⚠️ Beklenmeyen veri formatı:", data)
          setListings([])
        }
      } else {
        console.error("❌ İlanlar alınamadı:", response.status)
        setListings([])
        alert("İlanlarınız yüklenirken hata oluştu.")
      }
    } catch (error) {
      console.error("❌ API hatası:", error)
      setListings([])
      alert("Bağlantı hatası. Lütfen sayfayı yenileyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteListing = async (listingId: number) => {
    if (!userInfo?.username) return

    try {
      setDeletingId(listingId)
      console.log(`🗑️ İlan siliniyor: ${listingId}`)

      const response = await fetch(
        `https://hackback.hackstack.com.tr/delete_listing/${listingId}?username=${userInfo.username}`,
        {
          method: "DELETE",
        },
      )

      console.log("📥 Silme API yanıtı:", response.status, response.ok)

      if (response.ok) {
        console.log("✅ İlan başarıyla silindi")
        // İlanı listeden kaldır
        setListings((prev) => prev.filter((listing) => listing.id !== listingId))
        alert("İlan başarıyla silindi!")
      } else {
        console.error("❌ İlan silinemedi:", response.status)
        alert("İlan silinirken hata oluştu.")
      }
    } catch (error) {
      console.error("❌ Silme hatası:", error)
      alert("Bağlantı hatası.")
    } finally {
      setDeletingId(null)
    }
  }

  // Resim URL'ini oluştur
  const getImageUrl = (imageName: string) => {
    if (!imageName) return "/placeholder.svg?height=200&width=200"
    return `https://hackback.hackstack.com.tr/uploads/${imageName}`
  }

  // Tarih formatla
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Satış tarihini formatla
  const formatSoldDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // STX fiyatını formatla
  const formatSTXPrice = (price: string) => {
    const numPrice = Number.parseFloat(price)
    return numPrice.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })
  }

  // İstatistikler - Array kontrolü ile
  const activeListings = Array.isArray(listings) ? listings.filter((listing) => !listing.is_sold) : []
  const soldListings = Array.isArray(listings) ? listings.filter((listing) => listing.is_sold) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Profile Dön
              </Link>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">ChainGo</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{userInfo?.name ? `Merhaba, ${userInfo.name}` : ""}</span>
              <Button onClick={() => router.push("/create-listing")}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni İlan
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve İstatistikler */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">İlanlarım</h1>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Toplam İlan</p>
                    <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aktif İlan</p>
                    <p className="text-2xl font-bold text-gray-900">{activeListings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Satılan İlan</p>
                    <p className="text-2xl font-bold text-gray-900">{soldListings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">İlanlarınız yükleniyor...</span>
          </div>
        )}

        {/* İlanlar Grid */}
        {!isLoading && (
          <>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={
                          listing.images.length > 0
                            ? getImageUrl(listing.images[0])
                            : "/placeholder.svg?height=200&width=200"
                        }
                        alt={listing.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=200"
                        }}
                      />

                      {/* Durum Badge */}
                      <Badge className={`absolute top-2 left-2 ${listing.is_sold ? "bg-gray-600" : "bg-green-600"}`}>
                        {listing.is_sold ? "Satıldı" : "Aktif"}
                      </Badge>

                      {/* Kategori Badge */}
                      <Badge className="absolute top-2 right-2 bg-blue-600">{listing.category}</Badge>

                      {/* Çoklu Resim Göstergesi */}
                      {listing.images.length > 1 && (
                        <Badge className="absolute bottom-2 right-2 bg-black/50 text-white">
                          +{listing.images.length - 1}
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-orange-600 flex items-center">
                          {formatSTXPrice(listing.price)} <span className="text-lg ml-2 text-orange-500">STX</span>
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      {/* Konum ve Tarih */}
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(listing.created_at)}
                        </div>
                      </div>

                      {/* Açıklama */}
                      <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>

                      {/* Butonlar */}
                      <div className="flex space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => router.push(`/product/${listing.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Görüntüle
                        </Button>

                        {/* Silme butonu - sadece aktif ilanlar için */}
                        {!listing.is_sold ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" disabled={deletingId === listing.id}>
                                {deletingId === listing.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "{listing.title}" adlı ilanınızı silmek istediğinizden emin misiniz? Bu işlem geri
                                  alınamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteListing(listing.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <Button variant="outline" size="sm" disabled className="opacity-50 bg-transparent">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Satılan ilan bilgisi */}
                      {listing.is_sold && listing.buyer_username && listing.sold_at ? (
                        <div className="bg-green-100 border border-green-200 rounded-lg p-3 mt-2">
                          <div className="text-center">
                            <p className="text-green-800 text-sm font-medium">✅ Satış Tamamlandı</p>
                            <div className="text-green-700 text-xs mt-1 space-y-1">
                              <div className="flex items-center justify-center space-x-1">
                                <span>👤 Alıcı:</span>
                                <span className="font-medium">@{listing.buyer_username}</span>
                              </div>
                              <div className="flex items-center justify-center space-x-1">
                                <span>📅 Satış Tarihi:</span>
                                <span className="font-medium">{formatSoldDate(listing.sold_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : listing.is_sold ? (
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-2 mt-2">
                          <p className="text-xs text-gray-600 text-center">✅ Bu ilan satıldı ve silinemez</p>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Boş Durum */
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Henüz İlanınız Yok</h3>
                <p className="text-gray-500 mb-6">İlk ilanınızı vererek satışa başlayın!</p>
                <Button onClick={() => router.push("/create-listing")} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  İlk İlanımı Ver
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
