"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ShoppingBag,
  Wallet,
  Shield,
  Users,
  User,
  LogOut,
  Lock,
  CheckCircle,
  ArrowRight,
  Star,
  Smartphone,
  Globe,
  Zap,
  ShieldCheck,
  Clock,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
      // eslint-disable-next-line no-console
      console.log("🔐 Ana sayfa auth durumu:", authStatus.isAuthenticated)
    } catch (error) {
      // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log("👋 Kullanıcı çıkış yaptı")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold tracking-tight text-gray-900">ChainGo</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <a href="#features" className="hover:text-gray-900">Özellikler</a>
              <a href="#how" className="hover:text-gray-900">Nasıl Çalışır</a>
              <a href="#trust" className="hover:text-gray-900">Güven</a>
              <a href="#faq" className="hover:text-gray-900">SSS</a>
            </nav>
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              ) : isAuthenticated && user ? (
                <>
                  <span className="hidden sm:inline text-sm text-gray-600">Merhaba, <b>{user.username}</b></span>
                  <Button variant="outline" size="icon" onClick={handleProfile} aria-label="Profil">
                    <User className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Çıkış">
                    <LogOut className="h-4 w-4" />
                  </Button>
                  <Link href="/products">
                    <Button className="hidden sm:inline-flex">Ürünlere Git</Button>
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
      <section className="relative overflow-hidden">
        {/* soft bg decorations */}
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-3 py-1 text-xs text-gray-600 shadow-sm mb-5">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
              Web3 ile güvenli pazar yeri
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Web3 ile Güvenli
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> İkinci El </span>
              Alışveriş
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Blockchain teknolojisi ile güvenli, şeffaf ve merkezi olmayan bir ikinci el eşya pazarı. Cüzdanınızla bağlanın, anında alım–satım yapın.
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

            {/* trust bar */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Lock className="h-4 w-4" />, label: "KYC Doğrulama" },
                { icon: <Shield className="h-4 w-4" />, label: "Escrow Koruması" },
                { icon: <Clock className="h-4 w-4" />, label: "Hızlı İşlemler" },
                { icon: <Globe className="h-4 w-4" />, label: "Global Erişim" },
              ].map((i, idx) => (
                <div key={idx} className="mx-auto flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-gray-600 shadow-sm">
                  {i.icon}<span>{i.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section id="trust" className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "25K+", label: "Güvenli işlem" },
            { value: "8K+", label: "Doğrulanmış kullanıcı" },
            { value: "98%", label: "Memnuniyet" },
            { value: "<2dk", label: "Ortalama onay" },
          ].map((s, i) => (
            <Card key={i} className="bg-white/80">
              <CardContent className="py-6 text-center">
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="mt-1 text-sm text-gray-600">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Neden ChainGo?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Güvenli İşlemler</CardTitle>
                <CardDescription>Blockchain ile tüm işlemleriniz şeffaf ve değiştirilemez kayıt altında.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Wallet className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Kolay Ödeme</CardTitle>
                <CardDescription>Cüzdanınızla saniyeler içinde ödeme yapın, escrow ile koruma altında kalın.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Güvenilir Topluluk</CardTitle>
                <CardDescription>Doğrulanmış profiller, değerlendirmeler ve itibar puanlarıyla güvenle alışveriş.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-2xl font-semibold text-gray-900">Popüler Kategoriler</h3>
            <Link href="/products" className="text-sm text-blue-700 hover:underline inline-flex items-center">Hepsini Gör <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Web Sitesi Lisansı", emoji: "💻" },
              { title: "Oyun Lisansı", emoji: "🎮" },
              { title: "Koleksiyonlar", emoji: "🧩" },
              { title: "Yazılım Lisansı", emoji: "🧾" },
            ].map((c, i) => (
              <Card key={i} className="group overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{c.title}</div>
                    <div className="text-xs text-gray-600">Yüzlerce ilan</div>
                  </div>
                  <div className="text-3xl group-hover:scale-110 transition-transform">{c.emoji}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">3 Adımda Başlayın</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Smartphone className="h-6 w-6" />, title: "Cüzdanı Bağla", desc: "Metamask veya desteklenen cüzdanlardan biriyle giriş yapın." },
              { icon: <Zap className="h-6 w-6" />, title: "İlan Ver / Keşfet", desc: "Ürün ekleyin veya kategorilerde gezinin." },
              { icon: <ShieldCheck className="h-6 w-6" />, title: "Escrow ile Öde", desc: "Anlaşma sağlanınca fonlar akıllı sözleşme ile kilitlenir." },
            ].map((s, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border text-gray-700">{s.icon}</div>
                  <CardTitle>{s.title}</CardTitle>
                  <CardDescription>{s.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h3 className="text-2xl font-semibold text-gray-900">Kullanıcı Yorumları</h3>
            <div className="text-sm text-gray-600">Gerçek işlemlerden derlendi</div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "İlk kez bu kadar hızlı ve güvenli alışveriş yaptım.", name: "Ezgin", rating: 5
              },
              {
                quote: "Escrow sistemi içimi rahatlattı, satıcıyla sorunsuz anlaştık.", name: "Pelin", rating: 5
              },
              {
                quote: "Hayatımdaki en kolay ve en güvenli alışverişti.", name: "Göktuğ", rating: 4
              },
            ].map((t, i) => (
              <Card key={i} className="h-full">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-yellow-500" aria-label={`${t.rating} yıldız`}>
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-800">“{t.quote}”</p>
                  <div className="mt-2 text-sm text-gray-600">— {t.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security / Guarantees */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Güven Taahhüdümüz</h3>
            <p className="text-gray-600 mb-6">İşlemlerinizi çok katmanlı güvenlik ile koruyoruz. Akıllı sözleşmeler, escrow ve kullanıcı doğrulama birlikte çalışır.</p>
            <ul className="space-y-3 text-gray-700">
              {[
                "Zincir üstü işlem kanıtları",
                "Satıcı & Alıcı doğrulama",
                "Uyuşmazlık çözüm mekanizması",
                "İtibar ve değerlendirme puanları",
              ].map((li, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                <CardTitle>Escrow Koruması</CardTitle>
              </div>
              <CardDescription>Ödeme, iki taraf da onay verene kadar güvenle kilitlenir.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="rounded-lg border bg-white p-3">
                  <div className="font-semibold">Çoklu İmza</div>
                  <div>İşlem onayı için çoklu imza kontrolü.</div>
                </div>
                <div className="rounded-lg border bg-white p-3">
                  <div className="font-semibold">Zaman Kilidi</div>
                  <div>Süre aşımında fon iadesi otomatik.</div>
                </div>
                <div className="rounded-lg border bg-white p-3">
                  <div className="font-semibold">Uyuşmazlık</div>
                  <div>Arbitraj akışı ile çözüm.</div>
                </div>
                <div className="rounded-lg border bg-white p-3">
                  <div className="font-semibold">KYC Seçeneği</div>
                  <div>Gelişmiş doğrulama katmanı.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/70">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-10">Sık Sorulan Sorular</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Escrow tam olarak nasıl çalışır?</AccordionTrigger>
              <AccordionContent>
                Ödeme, akıllı sözleşmede kilitlenir. Ürün/anahtar teslimi onaylandığında fonlar satıcıya aktarılır; sorun olursa uyuşmazlık süreci başlatılır.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Hangi cüzdanlar destekleniyor?</AccordionTrigger>
              <AccordionContent>
                Başlıca tarayıcı cüzdanları ve mobil cüzdanlar desteklenir. Giriş ekranında tam listeyi görebilirsiniz.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>İade politikası nedir?</AccordionTrigger>
              <AccordionContent>
                Uyuşmazlık çözümü sonucuna göre iade süreçleri akıllı sözleşme tarafından otomatik işletilir.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <h4 className="text-2xl font-bold text-gray-900 mb-3">Hazır mısınız?</h4>
                <p className="text-gray-600 mb-6">Dakikalar içinde hesabınızı oluşturun, ilan verin veya güvenle alışverişe başlayın.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={isAuthenticated ? "/create-listing" : "/login"}>
                    <Button size="lg">
                      {isAuthenticated ? "İlan Ver" : "Wallet ile Başla"}
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" size="lg">Ürünleri Keşfet</Button>
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 md:p-10 flex items-center">
                <ul className="w-full space-y-3 text-gray-700">
                  {[
                    "Komisyonu düşük, şeffaf ücretler",
                    "Topluluk odaklı değerlendirme sistemi",
                    "API ve geliştirici dostu altyapı",
                  ].map((li, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-blue-600" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xl font-bold">ChainGo</span>
            </div>
            <p className="text-gray-400 text-center md:text-left">© 2025 ChainGo. Web3 ile güvenli alışveriş.</p>
            <div className="flex items-center gap-3 text-gray-400">
              <a href="/privacy" className="hover:text-white text-sm">Gizlilik</a>
              <a href="/terms" className="hover:text-white text-sm">Koşullar</a>
              <a href="/support" className="hover:text-white text-sm">Destek</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
