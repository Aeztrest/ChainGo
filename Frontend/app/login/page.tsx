"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Wallet, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  connectStacksWallet,
  checkStacksConnection,
  getStacksAccountDetails,
  checkUserExistsWithStacks,
  saveStacksUserData,
  clearStacksSession,
} from "@/lib/stacks-auth"

export default function LoginPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Sayfa yüklendiğinde bağlantı durumunu kontrol et
    checkInitialConnection()
  }, [])

  const checkInitialConnection = () => {
    console.log("🔍 Sayfa yüklendiğinde Stacks bağlantı durumu kontrol ediliyor...")
    const connected = checkStacksConnection()
    setIsConnected(connected)

    if (connected) {
      console.log("✅ Kullanıcı zaten bağlı, kullanıcı verilerini kontrol ediliyor...")
      handleExistingConnection()
    }
  }

  const handleExistingConnection = async () => {
    try {
      // Mevcut kullanıcı verilerini al
      const userData = JSON.parse(localStorage.getItem("stacks_user_data") || "null")

      if (userData) {
        console.log("👤 Mevcut Stacks kullanıcı verileri bulundu:", userData)

        // Backend'e kullanıcı kontrolü yap
        const backendResult = await checkUserExistsWithStacks(userData)

        if (backendResult && backendResult.status === true) {
          console.log("✅ Kullanıcı mevcut, ürünler sayfasına yönlendiriliyor...")
          saveStacksUserData(userData, backendResult)
          router.push("/products")
        } else {
          console.log("➕ Yeni kullanıcı, kayıt sayfasına yönlendiriliyor...")
          const stxAddress = userData.addresses?.stx?.[0]?.address || ""
          router.push(`/register?wallet_address=${stxAddress}`)
        }
      }
    } catch (error) {
      console.error("❌ Mevcut bağlantı kontrolü hatası:", error)
    }
  }

  const handleStacksConnect = async () => {
    setIsConnecting(true)
    console.log("🚀 Stacks wallet bağlantısı başlatılıyor...")

    try {
      // Stacks wallet'a bağlan
      const stacksUser = await connectStacksWallet()

      if (!stacksUser) {
        console.error("❌ Stacks wallet bağlantısı başarısız")
        alert("Wallet bağlantısı başarısız. Lütfen tekrar deneyin.")
        setIsConnecting(false)
        return
      }

      console.log("🎉 Stacks wallet bağlantısı başarılı!")
      setIsConnected(true)
      
      // Backend'e kullanıcı kontrolü yap
      console.log("🔍 Backend'e kullanıcı kontrolü yapılıyor...")
      const backendResult = await checkUserExistsWithStacks(stacksUser)

      if (!backendResult) {
        console.error("❌ Backend API hatası")
        alert("Bağlantı hatası. Lütfen tekrar deneyin.")
        setIsConnecting(false)
        return
      }

      // Backend sonucuna göre yönlendirme
      if (backendResult.status === true) {
        console.log("✅ Kullanıcı mevcut - Giriş başarılı!")
        console.log("🔐 JWT token alındı:", backendResult.token ? "Var" : "Yok")
        console.log("👤 Kullanıcı bilgileri:", backendResult.user)

        // Kullanıcı verilerini kaydet
        saveStacksUserData(stacksUser, backendResult)

        console.log("🎉 Giriş başarılı - Ürünler sayfasına yönlendiriliyor")
        router.push("/products")
      } else {
        console.log("➕ Yeni kullanıcı - Kayıt sayfasına yönlendiriliyor")

        // STX adresini al
        const stxAddress = stacksUser.addresses?.stx?.[0]?.address || ""
        console.log("📍 Kayıt için STX adresi:", stxAddress)

        // Stacks verilerini geçici olarak kaydet
        localStorage.setItem("stacks_user_data", JSON.stringify(stacksUser))

        router.push(`/register?wallet_address=${stxAddress}`)
      }
    } catch (error) {
      console.error("❌ Stacks wallet bağlantı hatası:", error)
      alert("Wallet bağlantısında hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    console.log("🔌 Stacks wallet bağlantısı kesiliyor...")
    clearStacksSession()
    setIsConnected(false)
    console.log("✅ Bağlantı kesildi ve veriler temizlendi")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ChainGo</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Hoş Geldiniz</h1>
          <p className="text-gray-600 mt-2">Stacks wallet'ınızla güvenli giriş yapın</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              {isConnected
                ? "Stacks wallet'ınız bağlı. Devam etmek için aşağıdaki butona tıklayın."
                : "Stacks Connect ile güvenli wallet bağlantısı kurun"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <Button onClick={handleStacksConnect} disabled={isConnecting} className="w-full h-12 text-lg" size="lg">
                <Wallet className="mr-3 h-5 w-5" />
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bağlanıyor...
                  </>
                ) : (
                  "Stacks Wallet ile Bağlan"
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800 text-sm">✅ Stacks wallet bağlantısı aktif</p>
                </div>
                <Button onClick={handleStacksConnect} disabled={isConnecting} className="w-full h-12 text-lg" size="lg">
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    "Devam Et"
                  )}
                </Button>
                <Button onClick={handleDisconnect} variant="outline" className="w-full bg-transparent" size="sm">
                  Bağlantıyı Kes
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              <p>Stacks wallet'ınız yok mu?</p>
              <a
                href="https://wallet.hiro.so/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Hiro Wallet'ı indirin
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Stacks blockchain ile güvenli ve merkezi olmayan giriş</p>
        </div>
      </div>
    </div>
  )
}
