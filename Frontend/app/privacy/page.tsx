"use client"

import Link from "next/link"
import { Shield, FileLock, EyeOff, Landmark, Wallet, Globe, Cookie, Store, Database, Mail, Phone, UserCheck, Clock, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
            <a href="#kapsam" className="hover:text-gray-900">Kapsam</a>
            <a href="#veriler" className="hover:text-gray-900">Toplanan Veriler</a>
            <a href="#kullanim" className="hover:text-gray-900">Kullanım Amaçları</a>
            <a href="#haklar" className="hover:text-gray-900">Haklarınız</a>
            <a href="#iletisim" className="hover:text-gray-900">İletişim</a>
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
            <FileLock className="h-3.5 w-3.5 text-blue-700" />
            Gizlilik Politikası
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Verilerinizi Şeffaf ve Güvenli Şekilde Koruyoruz</h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">Bu sayfa, ChainGo platformunu kullanırken kişisel verilerinizin nasıl işlendiğini, saklandığını ve korunduğunu açıklar.</p>
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
                  <li><a href="#kapsam" className="hover:underline">Kapsam ve Sorumlu</a></li>
                  <li><a href="#veriler" className="hover:underline">Topladığımız Veriler</a></li>
                  <li><a href="#kullanim" className="hover:underline">Kullanım Amaçları ve Dayanak</a></li>
                  <li><a href="#blokzincir" className="hover:underline">Blokzincir & Cüzdan</a></li>
                  <li><a href="#cerez" className="hover:underline">Çerezler</a></li>
                  <li><a href="#paylasim" className="hover:underline">Üçüncü Taraf Paylaşımları</a></li>
                  <li><a href="#saklama" className="hover:underline">Saklama Süreleri</a></li>
                  <li><a href="#guvenlik" className="hover:underline">Güvenlik</a></li>
                  <li><a href="#haklar" className="hover:underline">Haklarınız</a></li>
                  <li><a href="#cocuklar" className="hover:underline">Çocukların Gizliliği</a></li>
                  <li><a href="#transfer" className="hover:underline">Yurt Dışı Aktarım</a></li>
                  <li><a href="#degisiklik" className="hover:underline">Değişiklikler</a></li>
                  <li><a href="#iletisim" className="hover:underline">İletişim</a></li>
                </ul>
              </CardContent>
            </Card>
          </aside>

          {/* Content */}
          <section className="lg:col-span-2 space-y-6">
            <Card id="kapsam">
              <CardHeader className="flex flex-row items-center gap-3">
                <Shield className="h-5 w-5 text-blue-700" />
                <CardTitle>Kapsam ve Veri Sorumlusu</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Bu Gizlilik Politikası, ChainGo web sitesi ve uygulamalarının ("Platform") tüm kullanıcıları için geçerlidir. Platformu kullanarak burada açıklanan uygulamaları kabul etmiş sayılırsınız.</p>
                <p>Veri Sorumlusu: <b>ChainGo</b>. Bu politika; 6698 sayılı KVKK, GDPR ve ilgili mevzuatla uyumlu şekilde hazırlanmıştır.</p>
              </CardContent>
            </Card>

            <Card id="veriler">
              <CardHeader className="flex flex-row items-center gap-3">
                <Database className="h-5 w-5 text-blue-700" />
                <CardTitle>Topladığımız Veriler</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <ul className="list-disc ml-5 space-y-1">
                  <li><b>Hesap Bilgileri:</b> kullanıcı adı, profil bilgileri, iletişim tercihleri.</li>
                  <li><b>Cüzdan Bilgileri:</b> halka açık <i>wallet address</i>, işlem hash’leri (zincir üstü herkese açık verilerdir).</li>
                  <li><b>İşlem/İlan Verileri:</b> ilan başlıkları, açıklamalar, fiyat, durum, değerlendirme/yorumlar.</li>
                  <li><b>Teknik Veriler:</b> IP, tarayıcı/cihaz bilgisi, oturum tanımlayıcıları, çerez verileri.</li>
                  <li><b>Destek İletişimi:</b> gönderdiğiniz mesajlar, ekler.</li>
                </ul>
                <p><EyeOff className="inline h-4 w-4 mr-1" /> <b>Önemli:</b> Özel anahtarlarınızı (private key) asla toplamayız, saklamayız.</p>
              </CardContent>
            </Card>

            <Card id="kullanim">
              <CardHeader className="flex flex-row items-center gap-3">
                <Store className="h-5 w-5 text-blue-700" />
                <CardTitle>Verileri Kullanım Amaçlarımız ve Hukuki Dayanak</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Platformun çalıştırılması, güvenliğinin sağlanması ve performans analizi (<b>meşru menfaat</b>).</li>
                  <li>Hesap doğrulama, giriş ve kimlik yönetimi (<b>sözleşmenin ifası</b>).</li>
                  <li>Escrow/ödemeler ve işlem süreçlerinin yürütülmesi (<b>sözleşmenin ifası</b>).</li>
                  <li>Dolandırıcılık/istismar tespiti, uyuşmazlık çözümü (<b>meşru menfaat</b>, <b>hukuki yükümlülük</b>).</li>
                  <li>Pazarlama iletileri (varsa) (<b>açık rıza</b>, istediğiniz an geri alabilirsiniz).</li>
                </ul>
              </CardContent>
            </Card>

            <Card id="blokzincir">
              <CardHeader className="flex flex-row items-center gap-3">
                <Wallet className="h-5 w-5 text-blue-700" />
                <CardTitle>Blokzincir ve Cüzdan Hususları</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Blokzincir işlemleri geri döndürülemez ve herkese açık deftere kalıcı olarak yazılır. <b>Cüzdan adresiniz</b> ve işlemlerinize ilişkin <b>hash</b> bilgileri kamuya açık olabilir. Zincir üzerindeki verilerin silinmesi teknik olarak mümkün olmayabilir.</p>
                <p>Özel anahtarlarınız <b>yalnızca sizin kontrolünüzdedir</b>. Cüzdan sağlayıcınızın güvenlik önlemlerini ve yedeklemeyi kullanmanızı öneririz.</p>
              </CardContent>
            </Card>

            <Card id="cerez">
              <CardHeader className="flex flex-row items-center gap-3">
                <Cookie className="h-5 w-5 text-blue-700" />
                <CardTitle>Çerezler ve Benzeri Teknolojiler</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Oturum yönetimi, güvenlik ve analitik için zorunlu ve tercihe bağlı çerezler kullanırız. Tarayıcınızın ayarlarından çerez tercihlerinizi yönetebilirsiniz; ancak bazı özellikler devre dışı kalabilir.</p>
              </CardContent>
            </Card>

            <Card id="paylasim">
              <CardHeader className="flex flex-row items-center gap-3">
                <Globe className="h-5 w-5 text-blue-700" />
                <CardTitle>Üçüncü Taraflarla Paylaşımlar</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <ul className="list-disc ml-5 space-y-1">
                  <li><b>Hizmet sağlayıcılar:</b> barındırma, analitik, e-posta, müşteri destek araçları.</li>
                  <li><b>Ödeme/escrow altyapıları:</b> akıllı sözleşmeler, zincir üstü servisler.</li>
                  <li><b>Hukuki zorunluluk:</b> mahkeme/kurum talepleri, güvenlik ve sahtekârlık önleme.</li>
                </ul>
                <p>Paylaşımlar, gizlilik ve güvenlik yükümlülüklerine uygun sözleşmelerle yapılır.</p>
              </CardContent>
            </Card>

            <Card id="saklama">
              <CardHeader className="flex flex-row items-center gap-3">
                <Clock className="h-5 w-5 text-blue-700" />
                <CardTitle>Saklama Süreleri</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Verileri; hukuki yükümlülükler, uyuşmazlıkların çözümü ve meşru menfaatler kapsamında <b>gerektiği süre boyunca</b> saklarız. Blokzincir üzerindeki veriler kalıcı olabilir.</p>
              </CardContent>
            </Card>

            <Card id="guvenlik">
              <CardHeader className="flex flex-row items-center gap-3">
                <UserCheck className="h-5 w-5 text-blue-700" />
                <CardTitle>Güvenlik Önlemleri</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Endüstri standartlarında güvenlik kontrolleri, erişim kısıtları ve şifreleme yöntemleri uygularız. İnternet üzerinden hiçbir aktarımın %100 güvenli olmadığını hatırlatırız; en iyi uygulamaları birlikte sürdürmek esastır.</p>
              </CardContent>
            </Card>

            <Card id="haklar">
              <CardHeader className="flex flex-row items-center gap-3">
                <Landmark className="h-5 w-5 text-blue-700" />
                <CardTitle>Haklarınız</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <ul className="list-disc ml-5 space-y-1">
                  <li>Erişim, düzeltme, silme (mümkün olduğu ölçüde), işleme kısıtlama, itiraz.</li>
                  <li>Açık rızayı geri çekme ve profillemeye itiraz.</li>
                  <li>Veri taşınabilirliği talebi.</li>
                  <li>KVKK/GDPR kapsamındaki ilgili otoritelere şikâyet hakkı.</li>
                </ul>
                <p>Haklarınızı kullanmak için aşağıdaki iletişim kanallarından bize ulaşabilirsiniz.</p>
              </CardContent>
            </Card>

            <Card id="cocuklar">
              <CardHeader className="flex flex-row items-center gap-3">
                <EyeOff className="h-5 w-5 text-blue-700" />
                <CardTitle>Çocukların Gizliliği</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Platform, yerel mevzuatın belirlediği yaşın altındaki çocuklara yönelik değildir. Bu kapsamdaki verileri bilmeden topladığımızı düşünüyorsanız bizimle iletişime geçin.</p>
              </CardContent>
            </Card>

            <Card id="transfer">
              <CardHeader className="flex flex-row items-center gap-3">
                <Globe className="h-5 w-5 text-blue-700" />
                <CardTitle>Yurt Dışına Veri Aktarımı</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Hizmet sağlayıcılarımız farklı ülkelerde bulunabilir. Aktarımlar; sözleşmesel güvenceler, yeterlilik kararları veya yürürlükteki diğer yasal mekanizmalarla yapılır.</p>
              </CardContent>
            </Card>

            <Card id="degisiklik">
              <CardHeader className="flex flex-row items-center gap-3">
                <RotateCcw className="h-5 w-5 text-blue-700" />
                <CardTitle>Değişiklikler</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Bu politika zaman zaman güncellenebilir. En güncel sürüm bu sayfada yayımlanır ve yürürlük tarihi güncellenir.</p>
                <p className="text-sm text-gray-500">Yürürlük tarihi: 20 Eylül 2025</p>
              </CardContent>
            </Card>

            <Card id="iletisim">
              <CardHeader className="flex flex-row items-center gap-3">
                <Mail className="h-5 w-5 text-blue-700" />
                <CardTitle>İletişim</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>Gizlilikle ilgili soru ve talepleriniz için bizimle iletişime geçin:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> privacy@hackstack.com.tr</li>
                  <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +90 (535) 226 02 45</li>
                </ul>
                <p className="text-sm text-gray-500">Not: Bu metin bilgilendirme amaçlıdır ve hukuki danışmanlık teşkil etmez.</p>
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
