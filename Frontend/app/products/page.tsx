"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Search, Plus, Heart, MapPin, User, LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/favorites"
import { requireAuth, logout, type User as AuthUser } from "@/lib/auth"

interface Listing {
  id: number
  title: string
  description: string
  price: string
  category: string
  username: string
  images: string[]
  created_at: string
  is_sold: boolean
}

interface ListingsResponse {
  page: number
  page_size: number
  total_pages: number
  total_items: number
  listings: Listing[]
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tümü")
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [favoriteStates, setFavoriteStates] = useState<{ [key: number]: boolean }>({})
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const router = useRouter()

  const categories = [
    "Tümü",
    "Tasarım & Kreatif",
    "Müzik & Ses",
    "Video & Animasyon",
    "Yazılım & Teknoloji",
    "Dijital Eğitim",
    "NFT",
    "E-Kitap",
  ]

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
      console.log("🔐 Ürünler sayfası auth durumu:", authStatus.isAuthenticated)

      // Auth başarılıysa ürünleri yükle
      await fetchListings(1)
    } catch (error) {
      console.error("❌ Auth kontrolü hatası:", error)
      router.push("/login")
    } finally {
      setIsAuthLoading(false)
    }
  }

  // API'den ürünleri getir
  const fetchListings = async (page = 1) => {
    try {
      setIsLoading(true)
      console.log(`📤 Sayfa ${page} için ürünler getiriliyor...`)

      const response = await fetch(`https://hackback.hackstack.com.tr/list_active_listings?page=${page}&page_size=50`)

      console.log("📥 API yanıtı:", response.status, response.ok)

      if (response.ok) {
        const data: ListingsResponse = await response.json()
        console.log("✅ Ürünler alındı:", data)

        setListings(data.listings)
        setCurrentPage(data.page)
        setTotalPages(data.total_pages)
        setTotalItems(data.total_items)

        // Favori durumlarını güncelle
        const newFavoriteStates: { [key: number]: boolean } = {}
        data.listings.forEach((listing) => {
          newFavoriteStates[listing.id] = isFavorite(listing.id)
        })
        setFavoriteStates(newFavoriteStates)
      } else {
        console.error("❌ Ürünler alınamadı:", response.status)
        alert("Ürünler yüklenirken hata oluştu.")
      }
    } catch (error) {
      console.error("❌ API hatası:", error)
      alert("Bağlantı hatası. Lütfen sayfayı yenileyin.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrelenmiş ürünler
  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Tümü" || listing.category === selectedCategory
    return matchesSearch && matchesCategory && !listing.is_sold
  })

  // Resim URL'ini oluştur
  const getImageUrl = (imageName: string) => {
    if (!imageName) return "/placeholder.svg?height=200&width=200"

    console.log("🖼️ Resim URL oluşturuluyor:", imageName)
    const imageUrl = `https://hackback.hackstack.com.tr/uploads/${imageName}`
    console.log("📸 Tam resim URL:", imageUrl)

    return imageUrl
  }

  // Tarih formatla
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  // Favori toggle fonksiyonu
  const toggleFavorite = (listing: Listing, e: React.MouseEvent) => {
    e.stopPropagation() // Kart tıklamasını engelle

    const isCurrentlyFavorite = favoriteStates[listing.id]

    if (isCurrentlyFavorite) {
      // Favorilerden çıkar
      const success = removeFromFavorites(listing.id)
      if (success) {
        setFavoriteStates((prev) => ({
          ...prev,
          [listing.id]: false,
        }))
        console.log("💔 Favorilerden çıkarıldı:", listing.title)
      }
    } else {
      // Favorilere ekle
      const success = addToFavorites({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        image: listing.images.length > 0 ? listing.images[0] : "",
      })
      if (success) {
        setFavoriteStates((prev) => ({
          ...prev,
          [listing.id]: true,
        }))
        console.log("❤️ Favorilere eklendi:", listing.title)
      }
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchListings(page)
    }
  }

  const handleProductClick = (listingId: number) => {
    router.push(`/product/${listingId}`)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ChainGo</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && <span className="text-sm text-gray-600">Merhaba, {user.name}</span>}
              <Button onClick={() => router.push("/create-listing")}>
                <Plus className="h-4 w-4 mr-2" />
                İlan Ver
              </Button>
              <Button variant="outline" size="icon" onClick={handleProfile}>
                <User className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* İstatistikler */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Aktif İlanlar</h2>
            <div className="text-sm text-gray-500">
              Toplam {totalItems} ilan • Sayfa {currentPage}/{totalPages}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Ürünler yükleniyor...</span>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <Card
                  key={listing.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleProductClick(listing.id)}
                >
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
                        console.log("❌ Resim yüklenemedi:", target.src)
                        target.src = "/placeholder.svg?height=200&width=200"
                      }}
                      onLoad={() => {
                        console.log("✅ Resim başarıyla yüklendi:", listing.images[0])
                      }}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className={`absolute top-2 right-2 bg-white/80 hover:bg-white transition-colors ${
                        favoriteStates[listing.id]
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                      onClick={(e) => toggleFavorite(listing, e)}
                    >
                      <Heart className={`h-4 w-4 ${favoriteStates[listing.id] ? "fill-current" : ""}`} />
                    </Button>
                    <Badge className="absolute top-2 left-2 bg-blue-600">{listing.category}</Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600 flex items-center">
                        {formatSTXPrice(listing.price)} <span className="text-sm ml-1 text-orange-500">STX</span>
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        ✓ Aktif
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {listing.username}
                      </div>
                      <span>{formatDate(listing.created_at)}</span>
                    </div>
                    {listing.images.length > 1 && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          +{listing.images.length - 1} fotoğraf
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Önceki
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sonraki
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredListings.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== "Tümü" ? "Ürün bulunamadı" : "Henüz ilan yok"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== "Tümü"
                    ? "Arama kriterlerinizi değiştirip tekrar deneyin."
                    : "İlk ilanı siz verin!"}
                </p>
                {!searchTerm && selectedCategory === "Tümü" && (
                  <Button className="mt-4" onClick={() => router.push("/create-listing")}>
                    <Plus className="h-4 w-4 mr-2" />
                    İlan Ver
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
