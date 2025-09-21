"use client"

import Link from "next/link"
import { Scale, ShieldCheck, Wallet, Gavel, Landmark, Globe, FileText, Ban, AlertCircle, Receipt, Fingerprint, Handshake, Mail, Calendar, UserCheck, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ChainGo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#kabul" className="hover:text-gray-900">Kabul</a>
            <a href="#tanımlar" className="hover:text-gray-900">Tanımlar</a>
            <a href="#kullanim" className="hover:text-gray-900">Kullanım</a>
            <a href="#islem" className="hover:text-gray-900">İşlemler</a>
            <a href="#uyusmazlik" className="hover:text-gray-900">Uyuşmazlık</a>
            <a href="#hukuk" className="hover:text-gray-900">Hukuk</a>
          </nav>
          <Link href="/">
            <Button variant="outline">Geri Dön</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-14 px-4 sm:px-6 lg:px-8">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-3 py-1 text-xs text-gray-600 shadow-sm mb-4">
            <FileText className="h-3.5 w-3.5 text-blue-700" />
            Hizmet Koşulları
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ChainGo Kullanım Şartları</h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">Bu koşullar; ChainGo platformuna erişiminizi ve kullanımınızı düzenler. Platformu kullanarak bu koşulları kabul etmiş olursunuz.</p>
        </div>
      </section>

      <main className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Side Nav */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Hızlı Gezinti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <ul className="space-y-2 text-gray-700">
                  <li><a href="#kabul" className="hover:underline">Sözleşmenin Kabulü</a></li>
                  <li><a href="#tanımlar" className="hover:underline">Tanımlar</a></li>
                  <li><a href="#uygunluk" className="hover:underline">Uygunluk / Hesap</a></li>
                  <li><a href="#kullanim" className="hover:underline">Kabul Edilebilir Kullanım</a></li>
                  <li><a href="#icerik" className="hover:underline">Kullanıcı İçeriği & Lisans</a></li>
                  <li><a href="#fikri" className="hover:underline">Fikri Mülkiyet</a></li>
                  <li><a href="#islem" className="hover:underline">İlan, İşlem ve Escrow</a></li>
                  <li><a href="#ucret" className="hover:underline">Ücretler ve Vergiler</a></li>
                  <li><a href="#risk" className="hover:underline">Risk Bildirimi</a></li>
                  <li><a href="#sorumluluk" className="hover:underline">Sorumluluk Reddi/Sınırlama</a></li>
                  <li><a href="#uyusmazlik" className="hover:underline">Uyuşmazlık Çözümü</a></li>
                  <li><a href="#fesih" className="hover:underline">Fesih</a></li>
                  <li><a href="#degisiklik" className="hover:underline">Değişiklikler</a></li>
                  <li><a href="#hukuk" className="hover:underline">Geçerli Hukuk & Yetki</a></li>
                  <li><a href="#iletisim" className="hover:underline">İletişim</a></li>
                </ul>
              </CardContent>
            </Card>
          </aside>

          {/* Content */}
          <section className="lg:col-span-2 space-y-6">
            <Card id="kabul">
              <CardHeader className="flex flex-row items-center gap-3">
                <Handshake className="h-5 w-5 text-blue-700" />
                <CardTitle>Sözleşmenin Kabulü</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Bu Hizmet Koşulları ("Koşullar"), ChainGo web sitesi ve uygulamalarına ("Platform") erişiminizi düzenler. Platforma erişmek veya kullanmakla Koşulları ve <Link href="/privacy" className="text-blue-700 underline">Gizlilik Politikası</Link>'nı kabul edersiniz.</p>
              </CardContent>
            </Card>

            <Card id="tanımlar">
              <CardHeader className="flex flex-row items-center gap-3">
                <Scale className="h-5 w-5 text-blue-700" />
                <CardTitle>Tanımlar</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-2">
                <ul className="list-disc ml-5 space-y-1">
                  <li><b>Kullanıcı:</b> Platforma erişen gerçek veya tüzel kişi.</li>
                  <li><b>İlan:</b> Platformda yayımlanan ürün/hizmet duyurusu.</li>
                  <li><b>Escrow:</b> Akıllı sözleşme veya üçüncü taraf güvencesiyle fonların geçici olarak tutulması.</li>
                  <li><b>Cüzdan:</b> Kullanıcının blockchain varlıklarını yönettiği araç. Özel anahtar yalnızca kullanıcıdadır.</li>
                </ul>
              </CardContent>
            </Card>

            <Card id="uygunluk">
              <CardHeader className="flex flex-row items-center gap-3">
                <UserCheck className="h-5 w-5 text-blue-700" />
                <CardTitle>Uygunluk, Hesap ve Doğrulama</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Yerel mevzuatın öngördüğü asgari yaş ve ehliyete sahip olmalısınız.</li>
                  <li>Hesabınızı ve cüzdanınızı yalnızca siz kullanabilirsiniz; güvenliğinden siz sorumlusunuz.</li>
                  <li>Dolandırıcılık ve güvenlik amaçlı KYC/AML kontrolleri talep edilebilir.</li>
                </ul>
              </CardContent>
            </Card>

            <Card id="kullanim">
              <CardHeader className="flex flex-row items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-700" />
                <CardTitle>Kabul Edilebilir Kullanım</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Platformu yasadışı amaçlarla, hak ihlali oluşturan veya zararlı faaliyetlerle kullanamazsınız. Aşağıdaki içerik ve eylemler <b>yasaktır</b>:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Yasa dışı ürün/hizmetler; sahte, çalıntı, lisanssız veya telif ihlalli içerikler.</li>
                  <li>Kişisel verilerin izinsiz paylaşımı, spam, kimlik avı, kötü amaçlı yazılım.</li>
                  <li>Platform altyapısına müdahale, tersine mühendislik, otomatik veri çekme (izin dışında).</li>
                </ul>
              </CardContent>
            </Card>

            <Card id="icerik">
              <CardHeader className="flex flex-row items-center gap-3">
                <Gavel className="h-5 w-5 text-blue-700" />
                <CardTitle>Kullanıcı İçeriği ve Lisans</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>İlanlar, yorumlar ve diğer içerikleriniz size aittir. İçeriği yayınlayarak, Platformun çalışması ve tanıtımı için dünya çapında, devredilebilir, alt lisanslanabilir, telifsiz bir lisans verirsiniz. Telif hakkı ihlali bildirimleri değerlendirilebilir ve içeriğiniz kaldırılabilir.</p>
              </CardContent>
            </Card>

            <Card id="fikri">
              <CardHeader className="flex flex-row items-center gap-3">
                <Landmark className="h-5 w-5 text-blue-700" />
                <CardTitle>Fikri Mülkiyet</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Platform ve tüm bileşenleri (markalar, arayüz, yazılım) ChainGo veya lisans verenlerine aittir. Açıkça izin verilmedikçe çoğaltılamaz, dağıtılamaz, türev eser oluşturulamaz.</p>
              </CardContent>
            </Card>

            <Card id="islem">
              <CardHeader className="flex flex-row items-center gap-3">
                <Wallet className="h-5 w-5 text-blue-700" />
                <CardTitle>İlan, İşlemler ve Escrow</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Satıcı; ilanın doğruluğundan, sahiplik ve lisanslardan sorumludur.</li>
                  <li>Ödemeler, akıllı sözleşmeli escrow ile tutulabilir; koşullar sağlandığında serbest bırakılır.</li>
                  <li>Dijital lisans/anahtar teslimi ve iade akışı, ilan açıklamasındaki şartlara tabidir.</li>
                  <li>Blokzincir işlemleri geri döndürülemez nitelikte olabilir.</li>
                </ul>
              </CardContent>
            </Card>

            <Card id="ucret">
              <CardHeader className="flex flex-row items-center gap-3">
                <Receipt className="h-5 w-5 text-blue-700" />
                <CardTitle>Ücretler, Komisyonlar ve Vergiler</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Platform, ilan/işlem komisyonu veya hizmet bedeli uygulayabilir; güncel oranlar Platformda yayımlanır.</li>
                  <li>Ağ (gas) ücretleri kullanıcılara ait olabilir.</li>
                  <li>Vergisel yükümlülüklerinizi yerel mevzuata göre kendiniz takip ve beyan edersiniz.</li>
                </ul>
              </CardContent>
            </Card>

            <Card id="risk">
              <CardHeader className="flex flex-row items-center gap-3">
                <AlertCircle className="h-5 w-5 text-blue-700" />
                <CardTitle>Risk Bildirimi</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Blokzincir ve kripto varlık işlemleri fiyat dalgalanmasına, teknik arızalara, akıllı sözleşme zafiyetlerine ve üçüncü taraf kesintilerine maruz kalabilir. Özel anahtarlarınızın güvenliği sizin sorumluluğunuzdadır.</p>
              </CardContent>
            </Card>

            <Card id="sorumluluk">
              <CardHeader className="flex flex-row items-center gap-3">
                <Ban className="h-5 w-5 text-blue-700" />
                <CardTitle>Sorumluluk Reddi ve Sınırlama</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Platform “olduğu gibi” ve “mevcut hâliyle” sunulur; belirli bir amaca uygunluk garantisi verilmez.</li>
                  <li>Dolaylı, arızi, özel veya sonuçsal zararlardan, veri kaybından ve kâr kaybından ChainGo sorumlu değildir.</li>
                  <li>Yürürlükteki zorunlu tüketici korumaları saklıdır.</li>
                </ul>
              </CardContent>
            </Card>

            <Card id="uyusmazlik">
              <CardHeader className="flex flex-row items-center gap-3">
                <Gavel className="h-5 w-5 text-blue-700" />
                <CardTitle>Uyuşmazlık Çözümü</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Öncelikle destek kanallarımızdan bizimle iletişime geçerek çözüm arayınız. Taraflar anlaşamazsa; uyuşmazlık, zorunlu haller dışında, öncelikle arabuluculuğa götürülür. Escrow/akıllı sözleşme şartları teknik olarak belirleyici olabilir.</p>
              </CardContent>
            </Card>

            <Card id="fesih">
              <CardHeader className="flex flex-row items-center gap-3">
                <Ban className="h-5 w-5 text-blue-700" />
                <CardTitle>Fesih ve Askıya Alma</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Koşulları ihlal etmeniz hâlinde veya güvenlik/hukuki gereklilikler nedeniyle, hesabınızı ve erişiminizi bildirim yaparak veya acil durumlarda derhâl askıya alabilir ya da sonlandırabiliriz.</p>
              </CardContent>
            </Card>

            <Card id="degisiklik">
              <CardHeader className="flex flex-row items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-700" />
                <CardTitle>Değişiklikler</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Koşullar zaman zaman güncellenebilir. En güncel sürüm bu sayfada yayımlanır ve yürürlük tarihi güncellenir. Güncellemeler sonrası Platformu kullanmaya devam etmeniz yeni koşulları kabul ettiğiniz anlamına gelir.</p>
                <p className="text-sm text-gray-500">Yürürlük tarihi: 20 Eylül 2025</p>
              </CardContent>
            </Card>

            <Card id="hukuk">
              <CardHeader className="flex flex-row items-center gap-3">
                <Globe className="h-5 w-5 text-blue-700" />
                <CardTitle>Geçerli Hukuk ve Yetkili Mahkeme</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Koşullar, Türkiye Cumhuriyeti yasalarına tabidir. Zorunlu tüketici mevzuatı saklı kalmak kaydıyla; yetkili mahkeme ve icra daireleri İstanbul’dur.</p>
              </CardContent>
            </Card>

            <Card id="iletisim">
              <CardHeader className="flex flex-row items-center gap-3">
                <Mail className="h-5 w-5 text-blue-700" />
                <CardTitle>İletişim</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Sorularınız ve bildirimler için:</p>
                <ul className="space-y-2">
                  <li>support@chaingo.app</li>
                </ul>
                <p className="text-sm text-gray-500">Bu metin bilgilendirme amaçlıdır ve hukuki danışmanlık değildir. Spesifik durumlar için uzman görüşü almanız önerilir.</p>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">ChainGo</span>
          </div>
          <div className="text-gray-400 text-sm">© 2025 ChainGo. Tüm hakları saklıdır.</div>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <Link href="/privacy" className="hover:text-white">Gizlilik</Link>
            <Link href="/terms" className="hover:text-white">Koşullar</Link>
            <Link href="/support" className="hover:text-white">Destek</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
