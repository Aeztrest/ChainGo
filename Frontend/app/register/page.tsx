"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingBag, ArrowLeft, User, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const wallet = searchParams.get("wallet_address")

    if (!wallet) {
      router.push("/login")
      return
    }

    setWalletAddress(wallet)
  }, [searchParams, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Kullanıcı kayıt işlemi
      const response = await fetch("https://back.goktugtunc.com/create_new_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          nameSurname: `${formData.name} ${formData.surname}`,
          username: formData.username,
        }),
      })

      console.log("📥 Kayıt API yanıtı:", response.status, response.ok)

      if (response.ok) {
        console.log("✅ Kayıt başarılı")
        setIsSuccess(true)

        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        const errorData = await response.json()
        console.error("❌ Kayıt hatası:", errorData)
        alert("Kayıt işlemi başarısız. Lütfen tekrar deneyin.")
      }
    } catch (error) {
      console.error("❌ Kayıt hatası:", error)
      alert("Kayıt işleminde hata oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name.trim() && formData.surname.trim() && formData.username.trim()

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Kayıt Başarılı!</h2>
            <p className="text-gray-600 mb-4">
              Hesabınız başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Giriş Sayfasına Dön
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ChainGo</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Hesap Oluştur</h1>
          <p className="text-gray-600 mt-2">Profil bilgilerinizi tamamlayın</p>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader className="text-center">
            <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Profil Bilgileri</CardTitle>
            <CardDescription>ChainGo'da güvenli alışveriş için bilgilerinizi girin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Adınızı girin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="surname">Soyad *</Label>
                <Input
                  id="surname"
                  name="surname"
                  type="text"
                  value={formData.surname}
                  onChange={handleInputChange}
                  placeholder="Soyadınızı girin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı *</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Kullanıcı adınızı girin"
                  required
                />
              </div>

              {walletAddress && (
                <div className="space-y-2">
                  <Label>Wallet Adresi</Label>
                  <div className="p-2 bg-gray-100 rounded text-sm text-gray-600 break-all">{walletAddress}</div>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-lg" disabled={!isFormValid || isSubmitting} size="lg">
                {isSubmitting ? "Kaydediliyor..." : "Hesabı Oluştur"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Bilgileriniz blockchain ile güvence altında saklanır</p>
        </div>
      </div>
    </div>
  )
}
