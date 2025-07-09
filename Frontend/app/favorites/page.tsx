"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ArrowLeft, Heart, Eye, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { getFavorites, removeFromFavorites, type FavoriteItem } from "@/lib/favorites"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // JWT token kontrolü
    const token = localStorage.getItem("jwt_token")
    if (!token) {
      router.push("/login")
      return
    }

    // Favorileri yükle
    loadFavorites()
  }, [router])

  const loadFavorites = () => {
    try {
      setIsLoading(true)
      const savedFavorites = getFavorites()
      setFavorites(savedFavorites)
      console.log("✅ Favoriler yüklendi:", savedFavorites.length, "adet")
    } catch (error) {
      console.error("❌ Favoriler yüklenirken hata:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFavorite = (productId: number) => {
    const success = removeFromFavorites(productId)
    if (success) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== productId))
      console.log("💔 Favorilerden çıkarıldı:", productId)
    }
  }

  const handleViewProduct = (productId: number) => {
    router.push(`/product/${productId}`)
  }

  // Resim URL'ini oluştur
  const getImageUrl = (imageName: string) => {
    if (!imageName) return "/placeholder.svg?height=200&width=200"
    return `https://back.goktugtunc.com/uploads/${imageName}`
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
              <Button onClick={() => router.push("/products")}>Ürünlere Dön</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Favorilerim</h1>
          </div>
          <p className="text-gray-600">Beğendiğiniz ürünleri buradan takip edebilirsiniz</p>
        </div>

        {/* İstatistik */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Toplam Favori</p>
                  <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Favoriler yükleniyor...</span>
          </div>
        )}

        {/* Favoriler Grid */}
        {!isLoading && (
          <>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((favorite) => (
                  <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={favorite.image ? getImageUrl(favorite.image) : "/placeholder.svg?height=200&width=200"}
                        alt={favorite.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=200"
                        }}
                      />

                      {/* Favori Badge */}
                      <Badge className="absolute top-2 left-2 bg-red-600">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Favori
                      </Badge>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2">{favorite.title}</CardTitle>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          ₺{Number.parseFloat(favorite.price).toLocaleString("tr-TR")}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      {/* Eklenme Tarihi */}
                      <div className="text-sm text-gray-500">Favorilere eklendi: {formatDate(favorite.addedAt)}</div>

                      {/* Butonlar */}
                      <div className="flex space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleViewProduct(favorite.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Görüntüle
                        </Button>

                        <Button variant="destructive" size="sm" onClick={() => handleRemoveFavorite(favorite.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Boş Durum */
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Henüz Favori Ürününüz Yok</h3>
                <p className="text-gray-500 mb-6">
                  Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilere ekleyebilirsiniz
                </p>
                <Button onClick={() => router.push("/products")} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Ürünleri Keşfet
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
