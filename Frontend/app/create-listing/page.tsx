"use client"

import type React from "react"

import { mintProduct } from "@/lib/mintProduct";
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ArrowLeft, Upload, X, MapPin, Coins, Tag, FileText, Camera } from "lucide-react"
import Link from "next/link"

interface ListingForm {
  title: string
  description: string
  price: string
  category: string
  location: string
  condition: string
  username: string
  images: File[] // File array olarak değiştir
}

const categories = [
  "Elektronik",
  "Bilgisayar",
  "Telefon",
  "Ayakkabı",
  "Giyim",
  "Ev & Yaşam",
  "Kitap",
  "Spor",
  "Oyun",
  "Müzik",
  "Araç",
  "Diğer",
]

const conditions = ["Sıfır", "Sıfır Ayarında", "Az Kullanılmış", "Orta", "Eskimiş"]

const locations = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Mersin",
  "Kayseri",
]

export default function CreateListingPage() {
  const [formData, setFormData] = useState<ListingForm>({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    condition: "",
    username: "",
    images: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])
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
      // Username'i otomatik doldur
      setFormData((prev) => ({
        ...prev,
        username: user.username || "",
      }))
    }
  }, [router])

  const handleInputChange = (field: keyof ListingForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 5) {
      alert("Maksimum 5 fotoğraf yükleyebilirsiniz.")
      return
    }

    console.log("📤 Fotoğraflar seçiliyor...")

    // Dosyaları formData'ya ekle (File objesi olarak)
    const newImages = [...formData.images, ...files]
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }))

    // Preview için base64'e çevir
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImages((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    console.log("✅ Fotoğraflar seçildi:", files.length)
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)

    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }))
    setPreviewImages(newPreviews)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("jwt_token")
      if (!token) {
        alert("Giriş yapmadan ilan veremezsiniz.")
        setIsSubmitting(false)
        return
      }

      console.log("🪙 Mint işlemi başlatılıyor...")

      await mintProduct(formData.title, parseInt(formData.price))

      // Kullanıcı işlemi cüzdanda onayladıktan sonra burası çalışır
      console.log("✅ Mint işlemi başarılı, ilan gönderiliyor...")

      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("description", formData.description)
      submitData.append("price", formData.price)
      submitData.append("category", formData.category || "")
      submitData.append("location", formData.location || "")
      submitData.append("condition", formData.condition || "")
      submitData.append("username", formData.username)

      formData.images.forEach((file) => {
        submitData.append("images", file)
      })

      const response = await fetch("https://back.goktugtunc.com/create_listing", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type yazma, FormData otomatik ayarlar
        },
        body: submitData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log("✅ İlan başarıyla oluşturuldu:", result)
        alert("İlanınız başarıyla oluşturuldu!")
        router.push("/products")
      } else {
        const errorData = await response.json()
        console.error("❌ API Hatası:", errorData)
        alert("Mint başarılı ama ilan verilemedi.")
      }
    } catch (error: any) {
      console.error("❌ İşlem hatası:", error)
      alert("İşlem iptal edildi ya da bağlantı hatası oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    formData.title.trim() && formData.description.trim() && formData.price.trim() && formData.username.trim()

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
              <span className="text-sm text-gray-600">{userInfo?.name ? `Merhaba, ${userInfo.name}` : ""}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">İlan Ver</h1>
          <p className="text-gray-600 mt-2">Ürününüzü satmak için detayları doldurun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol Kolon - Ana Bilgiler */}
            <div className="lg:col-span-2 space-y-6">
              {/* Başlık ve Açıklama */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Ürün Bilgileri
                  </CardTitle>
                  <CardDescription>Ürününüzün temel bilgilerini girin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Ürün Başlığı <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Örn: iPhone 13 Pro Max 256GB"
                      maxLength={100}
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-gray-500">{formData.title.length}/100 karakter</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Açıklama <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Ürününüzün detaylı açıklamasını yazın..."
                      rows={6}
                      maxLength={1000}
                      required
                    />
                    <p className="text-xs text-gray-500">{formData.description.length}/1000 karakter</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">
                      Kullanıcı Adı <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      placeholder="Kullanıcı adınız"
                      className="h-12"
                      required
                      disabled={!!userInfo?.username} // Eğer kullanıcı bilgisi varsa disable et
                    />
                    {userInfo?.username && (
                      <p className="text-xs text-gray-500">Kullanıcı adınız otomatik olarak dolduruldu</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Fotoğraflar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Fotoğraflar
                  </CardTitle>
                  <CardDescription>
                    En fazla 5 fotoğraf yükleyebilirsiniz (İlk fotoğraf kapak resmi olacak)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Fotoğraf Yükleme */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={formData.images.length >= 5}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900">Fotoğraf Yükle</p>
                        <p className="text-sm text-gray-500">PNG, JPG, JPEG (Maks. 5MB)</p>
                        <p className="text-xs text-gray-400 mt-2">{formData.images.length}/5 fotoğraf yüklendi</p>
                      </label>
                    </div>

                    {/* Fotoğraf Önizleme */}
                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            {index === 0 && <Badge className="absolute top-2 left-2 bg-blue-600">Kapak</Badge>}
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sağ Kolon - Kategori ve Fiyat */}
            <div className="space-y-6">
              {/* Fiyat */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="h-5 w-5 mr-2" />
                    Fiyat (STX)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Satış Fiyatı (STX) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.000000"
                      min="0"
                      step="0.000001"
                      className="h-12 text-lg"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Stacks (STX) cinsinden fiyat girin</p>
                  </div>
                </CardContent>
              </Card>

              {/* Kategori */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Kategori
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Kategori seçin (opsiyonel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Durum</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Ürün durumu (opsiyonel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Konum */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Konum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Şehir</Label>
                    <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Şehir seçin (opsiyonel)" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* İlan Ver Butonu */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg"
                    disabled={!isFormValid || isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Mint & Yayınlanıyor..." : "Mint Et ve Yayınla"}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    <span className="text-red-500">*</span> işaretli alanlar zorunludur
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
