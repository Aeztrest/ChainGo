// JWT token doğrulama ve Stacks Connect entegrasyonu

import { checkStacksConnection, clearStacksSession } from "./stacks-auth"

export interface User {
  user_id: number
  username: string
  wallet: string
  name: string
}

export interface TokenVerifyResponse {
  valid: boolean
  user?: User
}

// JWT token'ı doğrula
export const verifyToken = async (): Promise<TokenVerifyResponse | null> => {
  try {
    const token = localStorage.getItem("jwt_token")

    if (!token) {
      console.log("🔍 JWT token bulunamadı")
      return { valid: false }
    }

    console.log("📤 JWT token doğrulanıyor...")

    const response = await fetch("https://hackback.hackstack.com.tr/verify_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: token,
      }),
    })

    console.log("📥 Token doğrulama yanıtı:", response.status, response.ok)

    if (response.ok) {
      const data: TokenVerifyResponse = await response.json()
      console.log("✅ Token doğrulama sonucu:", data)

      if (data.valid && data.user) {
        // Kullanıcı bilgilerini güncelle
        localStorage.setItem("user_info", JSON.stringify(data.user))
        console.log("👤 Kullanıcı bilgileri güncellendi:", data.user)
      }

      return data
    } else {
      console.error("❌ Token doğrulama başarısız:", response.status)
      return { valid: false }
    }
  } catch (error) {
    console.error("❌ Token doğrulama hatası:", error)
    return { valid: false }
  }
}

// Kullanıcı oturumunu sonlandır (Stacks Connect ile)
export const logout = (): void => {
  console.log("🚪 Kullanıcı oturumu sonlandırılıyor...")

  // Stacks bağlantısını ve tüm verileri temizle
  clearStacksSession()

  console.log("🧹 Oturum verileri temizlendi")
}

// Kullanıcının giriş yapıp yapmadığını kontrol et
export const checkAuthStatus = async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
  console.log("🔐 Auth durumu kontrol ediliyor...")

  // Önce Stacks bağlantısını kontrol et
  const stacksConnected = checkStacksConnection()
  console.log("🔗 Stacks bağlantı durumu:", stacksConnected)

  if (!stacksConnected) {
    console.log("❌ Stacks wallet bağlantısı yok - oturum sonlandırılıyor")
    logout()
    return { isAuthenticated: false }
  }

  // JWT token'ı kontrol et
  const result = await verifyToken()

  if (!result || !result.valid) {
    console.log("❌ JWT token geçersiz - oturum sonlandırılıyor")
    logout()
    return { isAuthenticated: false }
  }

  console.log("✅ Auth durumu geçerli")
  return {
    isAuthenticated: true,
    user: result.user,
  }
}

// Korumalı sayfa için auth kontrolü
export const requireAuth = async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
  console.log("🛡️ Korumalı sayfa auth kontrolü...")

  const authStatus = await checkAuthStatus()

  if (!authStatus.isAuthenticated) {
    console.log("🔒 Yetkisiz erişim - login sayfasına yönlendiriliyor")
  } else {
    console.log("✅ Yetkilendirilmiş erişim")
  }

  return authStatus
}
