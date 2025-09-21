"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingBag,
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  User,
  Calendar,
  Tag,
  Package,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { requireAuth, type User as AuthUser } from "@/lib/auth"
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/favorites"
import { openSTXTransfer } from "@stacks/connect"
import { AnchorMode } from "@stacks/transactions"
import { STACKS_TESTNET } from "@stacks/network"

interface ProductDetail {
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

interface STXBalance {
  balance: string
  estimated_balance: string
  pending_balance_inbound: string
  pending_balance_outbound: string
  total_sent: string
  total_received: string
  total_fees_sent: string
  total_miner_rewards_received: string
  lock_tx_id: string
  locked: string
  lock_height: number
  burnchain_lock_height: number
  burnchain_unlock_height: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [userBalance, setUserBalance] = useState<string | null>(null)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)

  const productId = params.id as string

  useEffect(() => {
    checkAuthAndLoadProduct()
  }, [productId])

  const checkAuthAndLoadProduct = async () => {
    try {
      setIsAuthLoading(true)
      const authStatus = await requireAuth()

      if (!authStatus.isAuthenticated) {
        router.push("/login")
        return
      }

      setUser(authStatus.user || null)
      console.log("🔐 Ürün detayı sayfası auth durumu:", authStatus.isAuthenticated)

      // Auth başarılıysa ürün detayını yükle
      await fetchProductDetail()
    } catch (error) {
      console.error("❌ Auth kontrolü hatası:", error)
      router.push("/login")
    } finally {
      setIsAuthLoading(false)
    }
  }

  const fetchProductDetail = async () => {
    try {
      setIsLoading(true)
      console.log(`📤 Ürün detayı getiriliyor: ${productId}`)

      const response = await fetch(`https://hackback.hackstack.com.tr/get_listing/${productId}`)

      console.log("📥 API yanıtı:", response.status, response.ok)

      if (response.ok) {
        const data: ProductDetail = await response.json()
        console.log("✅ Ürün detayı alındı:", data)
        setProduct(data)

        // Favori durumunu kontrol et
        setIsFavorited(isFavorite(data.id))
      } else {
        console.error("❌ Ürün detayı alınamadı:", response.status)
        alert("Ürün bulunamadı.")
        router.push("/products")
      }
    } catch (error) {
      console.error("❌ API hatası:", error)
      alert("Bağlantı hatası.")
      router.push("/products")
    } finally {
      setIsLoading(false)
    }
  }

  // Resim URL'ini oluştur - Doğru URL formatı
  const getImageUrl = (imageName: string) => {
    if (!imageName) return "/placeholder.svg?height=400&width=400"

    console.log("🖼️ Detay sayfası resim URL oluşturuluyor:", imageName)
    const imageUrl = `https://hackback.hackstack.com.tr/uploads/${imageName}`
    console.log("📸 Detay sayfası tam resim URL:", imageUrl)

    return imageUrl
  }

  // Tarih formatla
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
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

  // STX'i microSTX'e çevir
  const stxToMicroSTX = (stx: string): string => {
    const stxAmount = Number.parseFloat(stx)
    return (stxAmount * 1_000_000).toString()
  }

  // STX bakiyesini getir fonksiyonunu güncelle
  const fetchSTXBalance = async (walletAddress: string): Promise<STXBalance | null> => {
    try {
      setIsBalanceLoading(true)
      setBalanceError(null)
      console.log("💰 STX bakiyesi getiriliyor:", walletAddress)

      // Yeni API endpoint'i kullan (testnet için)
      const response = await fetch(`https://api.testnet.hiro.so/extended/v1/address/${walletAddress}/balances`)

      console.log("📥 Hiro API yanıtı:", response.status, response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log("✅ STX bakiye verisi alındı:", data)

        // Yeni veri yapısı - stx objesi içindeki değerleri kullan
        if (data && data.stx) {
          return {
            balance: data.stx.balance,
            estimated_balance: data.stx.estimated_balance,
            pending_balance_inbound: data.stx.pending_balance_inbound,
            pending_balance_outbound: data.stx.pending_balance_outbound,
            total_sent: data.stx.total_sent,
            total_received: data.stx.total_received,
            total_fees_sent: data.stx.total_fees_sent,
            total_miner_rewards_received: data.stx.total_miner_rewards_received,
            lock_tx_id: data.stx.lock_tx_id,
            locked: data.stx.locked,
            lock_height: data.stx.lock_height,
            burnchain_lock_height: data.stx.burnchain_lock_height,
            burnchain_unlock_height: data.stx.burnchain_unlock_height,
          }
        }

        setBalanceError("Bakiye verisi uygun formatta değil")
        return null
      } else {
        console.error("❌ STX bakiyesi alınamadı:", response.status)
        setBalanceError("Bakiye bilgisi alınamadı")
        return null
      }
    } catch (error) {
      console.error("❌ STX bakiye API hatası:", error)
      setBalanceError("Bağlantı hatası")
      return null
    } finally {
      setIsBalanceLoading(false)
    }
  }

  // STX miktarını microSTX'den STX'e çevir
  const microSTXToSTX = (microSTX: string): number => {
    return Number.parseInt(microSTX) / 1000000
  }

  // Bakiye yeterli mi kontrol et
  const checkBalanceSufficiency = (balance: string, requiredAmount: string): boolean => {
    const balanceSTX = microSTXToSTX(balance)
    const requiredSTX = Number.parseFloat(requiredAmount)
    return balanceSTX >= requiredSTX
  }

  // Satıcının wallet adresini al
  const getSellerWalletAddress = async (sellerUsername: string): Promise<string | null> => {
    try {
      console.log("📤 Satıcının wallet adresi getiriliyor:", sellerUsername)

      const response = await fetch(
        `https://hackback.hackstack.com.tr/get_user_wallet?username=${encodeURIComponent(sellerUsername)}`,
      )

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Satıcı wallet adresi alındı:", data)
        return data.wallet_address || null
      } else {
        console.error("❌ Satıcı wallet adresi alınamadı:", response.status)
        return null
      }
    } catch (error) {
      console.error("❌ Satıcı wallet API hatası:", error)
      return null
    }
  }

  // Satın alma işlemini tamamla
  const completePurchase = async (listingId: string, buyerUsername: string, txId: string) => {
    try {
      console.log("📤 Satın alma işlemi tamamlanıyor...")
      console.log("🏷️ Listing ID:", listingId)
      console.log("👤 Buyer:", buyerUsername)
      console.log("🔗 TX ID:", txId)

      const response = await fetch("https://hackback.hackstack.com.tr/complete_purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: Number.parseInt(listingId),
          buyer_username: buyerUsername,
          txid: txId,
        }),
      })

      console.log("📥 Complete purchase API yanıtı:", response.status, response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Satın alma işlemi backend'de tamamlandı:", result)
        return true
      } else {
        console.error("❌ Backend'de satın alma işlemi başarısız:", response.status)
        return false
      }
    } catch (error) {
      console.error("❌ Complete purchase API hatası:", error)
      return false
    }
  }

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
      setIsImageLoading(true)
    }
  }

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
      setIsImageLoading(true)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Paylaşım iptal edildi")
      }
    } else {
      // Fallback: URL'yi kopyala
      navigator.clipboard.writeText(window.location.href)
      alert("Link kopyalandı!")
    }
  }

  const toggleFavorite = () => {
    if (!product) return

    if (isFavorited) {
      // Favorilerden çıkar
      const success = removeFromFavorites(product.id)
      if (success) {
        setIsFavorited(false)
        console.log("💔 Favorilerden çıkarıldı:", product.title)
      }
    } else {
      // Favorilere ekle
      const success = addToFavorites({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images.length > 0 ? product.images[0] : "",
      })
      if (success) {
        setIsFavorited(true)
        console.log("❤️ Favorilere eklendi:", product.title)
      }
    }
  }

  const handlePurchase = async () => {
    if (!product || !user) return

    // Kendi ürününü satın alamaz
    if (product.username === user.username) {
      alert("Kendi ürününüzü satın alamazsınız!")
      return
    }

    // Satılmış ürün kontrolü
    if (product.is_sold) {
      alert("Bu ürün zaten satılmış!")
      return
    }

    setIsPurchasing(true)
    console.log("🛒 Satın alma işlemi başlatılıyor...")
    console.log("👤 Alıcı:", user.username)
    console.log("🏷️ Ürün:", product.title)
    console.log("💰 Fiyat:", product.price, "STX")

    try {
      // Stacks Connect yüklü mü kontrol et
      if (typeof window !== "undefined" && !window.StacksProvider) {
        alert(
          "Stacks wallet extension'ı bulunamadı!\n\nLütfen Hiro Wallet veya Xverse Wallet'ı yükleyin:\n- Hiro Wallet: https://wallet.hiro.so/\n- Xverse: https://www.xverse.app/",
        )
        return
      }

      console.log("✅ Stacks wallet extension bulundu")

      // Kullanıcının wallet adresini al
      const stacksUserData = localStorage.getItem("stacks_user_data")
      if (!stacksUserData) {
        alert("Wallet bilgisi bulunamadı. Lütfen tekrar giriş yapın.")
        return
      }

      const stacksUser = JSON.parse(stacksUserData)
      const buyerWalletAddress = stacksUser.addresses?.stx?.[0]?.address

      if (!buyerWalletAddress) {
        alert("Wallet adresi bulunamadı. Lütfen tekrar giriş yapın.")
        return
      }

      console.log("📍 Alıcı wallet adresi:", buyerWalletAddress)

      // STX bakiyesini kontrol et
      console.log("💰 Bakiye kontrol ediliyor...")
      const balanceData = await fetchSTXBalance(buyerWalletAddress)

      if (!balanceData) {
        alert("Bakiye bilgisi alınamadı. Lütfen tekrar deneyin.")
        return
      }

      // Bakiye bilgilerini state'e kaydet
      setUserBalance(balanceData.balance)

      // Bakiye kontrolü
      const userBalanceSTX = microSTXToSTX(balanceData.balance)
      const requiredSTX = Number.parseFloat(product.price)
      const isBalanceSufficient = checkBalanceSufficiency(balanceData.balance, product.price)

      console.log("💰 Kullanıcı bakiyesi:", userBalanceSTX, "STX")
      console.log("💸 Gerekli miktar:", requiredSTX, "STX")
      console.log("✅ Bakiye yeterli mi:", isBalanceSufficient)

      if (!isBalanceSufficient) {
        alert(
          `Bakiyeniz yetersiz!\n\nMevcut Bakiye: ${userBalanceSTX.toFixed(6)} STX\nGerekli Miktar: ${requiredSTX.toFixed(6)} STX`,
        )
        return
      }

      // Satıcının wallet adresini al
      console.log("📤 Satıcı wallet adresi alınıyor...")
      const sellerWalletAddress = await getSellerWalletAddress(product.username)
      if (!sellerWalletAddress) {
        alert("Satıcının wallet adresi bulunamadı. Lütfen tekrar deneyin.")
        return
      }

      console.log("📍 Satıcı wallet adresi:", sellerWalletAddress)

      // Kullanıcıdan onay al
      const confirmPurchase = confirm(
        `${product.title} ürününü ${formatSTXPrice(product.price)} STX karşılığında satın almak istediğinizden emin misiniz?\n\nBu işlem blockchain üzerinde gerçekleştirilecek ve geri alınamaz.`,
      )

      if (!confirmPurchase) {
        console.log("❌ Satın alma iptal edildi")
        return
      }

      // STX transferi için miktar hesapla
      const amountInMicroSTX = stxToMicroSTX(product.price)
      console.log("💸 MicroSTX miktarı:", amountInMicroSTX)
      console.log("📊 Transfer parametreleri:")
      console.log("- Recipient:", sellerWalletAddress)
      console.log("- Amount:", amountInMicroSTX)
      console.log("- Network:", "STACKS_TESTNET")

      console.log("🚀 Stacks Connect ile STX transfer başlatılıyor...")

      // STX transfer işlemini başlat
      try {
        openSTXTransfer({
          recipient: sellerWalletAddress,
          amount: amountInMicroSTX,
          network: STACKS_TESTNET,
          anchorMode: AnchorMode.Any,
          memo: `ChainGo - ${product.title} satın alımı`,
          appDetails: {
            name: "ChainGo",
            icon: `${window.location.origin}/favicon.ico`,
          },
          onFinish: async (data) => {
            console.log("🎉 STX Transfer tamamlandı!")
            console.log("🔗 TX Hash:", data.txId)
            console.log("📊 Transfer data:", data)

            try {
              // Backend'e satın alma bilgisini gönder
              console.log("📤 Backend'e purchase completion gönderiliyor...")
              const purchaseCompleted = await completePurchase(productId, user.username, data.txId)

              if (purchaseCompleted) {
                alert(
                  `🎉 Satın alma başarılı!\n\n✅ Transaction ID: ${data.txId}\n💰 Ödenen Miktar: ${formatSTXPrice(product.price)} STX\n\nÜrün artık sizin!`,
                )

                // Ürünler sayfasına yönlendir
                router.push("/products")
              } else {
                alert(
                  `⚠️ Transaction başarılı ancak backend güncellemesinde sorun oluştu.\n\nTransaction ID: ${data.txId}\n\nLütfen destek ile iletişime geçin.`,
                )
              }
            } catch (error) {
              console.error("❌ Purchase completion hatası:", error)
              alert(
                `⚠️ Transaction başarılı ancak işlem tamamlanırken hata oluştu.\n\nTransaction ID: ${data.txId}\n\nLütfen destek ile iletişime geçin.`,
              )
            }
          },
          onCancel: () => {
            console.log("❌ STX Transfer iptal edildi")
            alert("İşlem iptal edildi.")
          },
        })

        console.log("✅ openSTXTransfer çağrısı başarılı - wallet popup'ı açılmalı")

        // Popup açılma kontrolü için timeout
        setTimeout(() => {
          console.log("⏰ 3 saniye geçti, popup açıldı mı kontrol ediliyor...")
          // Eğer hala işleniyor durumundaysa ve popup açılmadıysa
          if (isPurchasing) {
            console.log("⚠️ Popup açılmamış gibi görünüyor")
            alert("Wallet popup'ı açılmadı. Lütfen popup blocker'ınızı kontrol edin ve tekrar deneyin.")
          }
        }, 3000)
      } catch (openSTXError) {
        console.error("❌ openSTXTransfer çağrısı hatası:", openSTXError)
        console.error("❌ openSTXTransfer hata detayları:", {
          name: openSTXError.name,
          message: openSTXError.message,
          stack: openSTXError.stack,
        })

        if (openSTXError.message?.includes("popup")) {
          alert("Popup blocker tarafından engellenmiş olabilir. Lütfen popup'lara izin verin ve tekrar deneyin.")
        } else {
          alert(
            `Wallet bağlantısı hatası:\n\n${openSTXError.message}\n\nLütfen wallet extension'ınızın aktif olduğundan emin olun.`,
          )
        }
        throw openSTXError
      }
    } catch (error) {
      console.error("❌ Satın alma hatası:", error)
      console.error("❌ Hata detayları:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })

      // Daha spesifik hata mesajları
      if (error.message?.includes("wallet")) {
        alert("Wallet bağlantısı hatası. Lütfen wallet'ınızın bağlı olduğundan emin olun.")
      } else if (error.message?.includes("network")) {
        alert("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.")
      } else if (error.message?.includes("insufficient")) {
        alert("Yetersiz bakiye hatası.")
      } else {
        alert(`Satın alma işlemi sırasında hata oluştu:\n\n${error.message}\n\nLütfen tekrar deneyin.`)
      }
    } finally {
      // Her durumda loading durumunu kapat
      setIsPurchasing(false)
      console.log("🔄 isPurchasing durumu false yapıldı")
    }
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
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün Bulunamadı</h3>
            <p className="text-gray-500 mb-4">Aradığınız ürün mevcut değil.</p>
            <Button onClick={() => router.push("/products")}>Ürünlere Dön</Button>
          </CardContent>
        </Card>
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
            <div className="flex items-center space-x-2">
              {user && <span className="text-sm text-gray-600">Merhaba, {user.name}</span>}
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFavorite}
                className={isFavorited ? "text-red-500 hover:text-red-600" : ""}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Kolon - Resimler */}
          <div className="space-y-4">
            {/* Ana Resim */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square relative">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
                <img
                  src={
                    product.images.length > 0
                      ? getImageUrl(product.images[currentImageIndex])
                      : "/placeholder.svg?height=400&width=400"
                  }
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    setIsImageLoading(false)
                    console.log("✅ Detay sayfası resim yüklendi:", product.images[currentImageIndex])
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    console.log("❌ Detay sayfası resim yüklenemedi:", target.src)
                    target.src = "/placeholder.svg?height=400&width=400"
                    setIsImageLoading(false)
                  }}
                />

                {/* Resim Navigasyon */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Resim Sayacı */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Küçük Resimler */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index)
                      setIsImageLoading(true)
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={getImageUrl(image) || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=100&width=100"
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Kolon - Ürün Bilgileri */}
          <div className="space-y-6">
            {/* Başlık ve Fiyat */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge className="bg-blue-600">{product.category}</Badge>
                      {product.is_sold ? (
                        <Badge className="bg-gray-600">Satıldı</Badge>
                      ) : (
                        <Badge className="bg-green-600">Satışta</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-orange-600 flex items-center">
                  {formatSTXPrice(product.price)} <span className="text-lg ml-2 text-orange-500">STX</span>
                </div>
                <p className="text-sm text-gray-500">Stacks (STX) cinsinden fiyat</p>
              </CardHeader>
            </Card>

            {/* Satın Al Butonu */}
            <Card>
              <CardContent className="p-6">
                {product.is_sold ? (
                  <div className="text-center">
                    <div className="p-4 bg-gray-100 rounded-lg mb-4">
                      <p className="text-gray-600 font-medium">Bu ürün satılmış</p>
                    </div>
                    <Button disabled className="w-full h-14 text-lg" size="lg">
                      <Package className="mr-2 h-5 w-5" />
                      Ürün Satıldı
                    </Button>
                  </div>
                ) : user && product.username === user.username ? (
                  <div className="text-center">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <p className="text-blue-800 font-medium">Bu sizin ürününüz</p>
                    </div>
                    <Button disabled className="w-full h-14 text-lg" size="lg">
                      <User className="mr-2 h-5 w-5" />
                      Kendi Ürününüz
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Bakiye Bilgisi */}
                    {userBalance && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-800">Wallet Bakiyeniz:</span>
                          <span className="font-bold text-blue-600">{microSTXToSTX(userBalance).toFixed(6)} STX</span>
                        </div>
                        {checkBalanceSufficiency(userBalance, product.price) ? (
                          <p className="text-green-600 text-xs mt-1">✅ Bakiye yeterli</p>
                        ) : (
                          <p className="text-red-600 text-xs mt-1">❌ Bakiye yetersiz</p>
                        )}
                      </div>
                    )}

                    {/* Bakiye yükleniyor */}
                    {isBalanceLoading && (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-1" />
                        <p className="text-gray-600 text-xs">Bakiye kontrol ediliyor...</p>
                      </div>
                    )}

                    {/* Bakiye hatası */}
                    {balanceError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-xs">⚠️ {balanceError}</p>
                      </div>
                    )}
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-orange-800 font-medium">Toplam Tutar:</span>
                        <span className="text-2xl font-bold text-orange-600">{formatSTXPrice(product.price)} STX</span>
                      </div>
                      <p className="text-xs text-orange-600 mt-1">
                        Ödeme Stacks blockchain üzerinden gerçekleştirilecek
                      </p>
                    </div>
                    <Button
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="w-full h-14 text-lg bg-orange-600 hover:bg-orange-700"
                      size="lg"
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          İşleniyor...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Satın Al ({formatSTXPrice(product.price)} STX)
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 text-center">🔒 Güvenli ödeme Stacks blockchain ile sağlanır</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Açıklama */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Ürün Açıklaması
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </CardContent>
            </Card>

            {/* Ürün Detayları */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Ürün Detayları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kategori</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">İlan Tarihi</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium">{formatDate(product.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Satıcı Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Satıcı Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">@{product.username}</div>
                    <div className="text-sm text-gray-500">Doğrulanmış Stacks Kullanıcısı</div>
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
