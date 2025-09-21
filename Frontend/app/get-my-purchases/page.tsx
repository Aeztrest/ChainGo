"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ShoppingBag, Search, ArrowLeft } from "lucide-react"
import { requireAuth, type User as AuthUser } from "@/lib/auth"

// ---- API Response Types (FastAPI: /get_user_purchases) ----
type PurchaseRow = {
  id: number
  title: string
  description?: string | null
  price: string            // DECIMAL -> string
  category?: string | null
  seller_username: string
  buyer_username: string
  images?: string[]        // JSON -> dizi (backend zaten parse edip göndermiyorsa boş kalsın)
  created_at?: string | null // ISO
  is_sold: boolean | number
  sold_at?: string | null    // ISO
}

type PurchasesResponse = {
  purchases: PurchaseRow[]
}

// ---- Utils ----
function formatDateTR(iso?: string | null) {
  if (!iso) return "-"
  const d = new Date(iso)
  return d.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function PurchasesPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<PurchaseRow[]>([])
  const [query, setQuery] = useState("")

  // ---- Auth gate ----
  useEffect(() => {
    (async () => {
      try {
        const res = await requireAuth()
        if (!res.isAuthenticated) {
          router.push("/login")
          return
        }
        setUser(res.user || null)
      } catch (e) {
        console.error(e)
        router.push("/login")
      } finally {
        setLoadingAuth(false)
      }
    })()
  }, [router])

  // ---- Data load ----
  useEffect(() => {
    if (!user?.username) return
    const ctl = new AbortController()

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        // Eğer backend /api altında ise aşağıyı /api/get_user_purchases yap:
        const FETCH_URL = `https://hackback.hackstack.com.tr/get_user_purchases?username=${encodeURIComponent(user.username)}`
        const res = await fetch(FETCH_URL, { signal: ctl.signal, credentials: "include" })
        if (!res.ok) throw new Error("Satın alımlar yüklenemedi")

        const data: PurchasesResponse = await res.json()
        setRows(data?.purchases ?? [])
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message || "Bir hata oluştu")
      } finally {
        setLoading(false)
      }
    })()

    return () => ctl.abort()
  }, [user?.username])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(p =>
      !q
        ? true
        : [
            p.title,
            p.category,
            p.seller_username,
            String(p.id),
          ]
            .filter(Boolean)
            .some(v => String(v).toLowerCase().includes(q))
    )
  }, [rows, query])

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-white grid place-items-center">
        <div className="text-center text-gray-600">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3 text-blue-600" />
          Yetkilendirme kontrol ediliyor…
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" /> Profil
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ChainGo</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {user?.username && <>Giriş yapan: <b>{user.username}</b></>}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Satın Alımlarım</h1>
            <p className="text-gray-600">Daha önce yaptığınız işlemler ve detayları.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Input
                placeholder="Ara: başlık, satıcı, kategori…"
                className="pl-9"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">Alışverişe Devam Et</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Geçmiş İşlemler</CardTitle>
            <CardDescription>Arayın ve ilan sayfasına gidin.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-16 text-center text-gray-600">
                <Loader2 className="h-8 w-8 animate-spin inline-block mr-2 text-blue-600" /> Yükleniyor…
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-600">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-600">
                Kriterlere uygun sonuç yok. <Link className="text-blue-700 underline" href="/products">Ürünleri keşfet</Link>.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ürün</TableHead>
                      <TableHead>Satıcı</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead className="text-right">Tutar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={p.id} className="align-top">
                        <TableCell>
                          <div className="font-medium text-gray-900">{p.title}</div>
                          {p.category && <div className="text-xs text-gray-500">{p.category}</div>}
                        </TableCell>
                        <TableCell className="text-gray-700">@{p.seller_username}</TableCell>
                        <TableCell className="text-gray-700">
                          {formatDateTR(p.sold_at || p.created_at)}
                        </TableCell>
                        <TableCell className="text-right text-gray-900 font-medium">
                          {p.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <Separator className="my-6" />
            <div className="text-xs text-gray-500">
              Yardım için <Link href="/support" className="underline">Destek</Link> sayfasına göz atın.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
