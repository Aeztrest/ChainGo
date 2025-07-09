// Stacks Connect ile wallet doğrulama ve kullanıcı yönetimi

import { connect, disconnect, isConnected, getLocalStorage, request } from "@stacks/connect"

export interface StacksUser {
  addresses: {
    stx: Array<{ address: string }>
    btc: Array<{ address: string }>
  }
}

export interface StacksAccount {
  address: string
  publicKey: string
  gaiaHubUrl: string
  gaiaAppKey: string
}

export interface StacksAccountsResponse {
  addresses: StacksAccount[]
}

// Stacks wallet'a bağlan
export const connectStacksWallet = async (): Promise<StacksUser | null> => {
  try {
    console.log("🔗 Stacks wallet bağlantısı başlatılıyor...")

    const response = await connect()
    console.log("✅ Stacks wallet bağlantısı başarılı:", response)

    // Kullanıcı verilerini al
    const userData = getLocalStorage()
    console.log("👤 Stacks kullanıcı verileri:", userData)

    if (userData && userData.addresses) {
      console.log("📍 STX Adresleri:", userData.addresses.stx)
      console.log("₿ BTC Adresleri:", userData.addresses.btc)

      return userData as StacksUser
    }

    return null
  } catch (error) {
    console.error("❌ Stacks wallet bağlantı hatası:", error)
    return null
  }
}

// Wallet bağlantı durumunu kontrol et
export const checkStacksConnection = (): boolean => {
  const connected = isConnected()
  console.log("🔍 Stacks wallet bağlantı durumu:", connected)
  return connected
}

// Wallet bağlantısını kes
export const disconnectStacksWallet = (): void => {
  console.log("🔌 Stacks wallet bağlantısı kesiliyor...")
  disconnect()
  console.log("✅ Stacks wallet bağlantısı kesildi ve localStorage temizlendi")
}

// Stacks adresini backend formatına çevir
export const formatStacksAddressForBackend = (userData: StacksUser): string => {
  if (userData.addresses && userData.addresses.stx && userData.addresses.stx.length > 0) {
    const stxAddress = userData.addresses.stx[0].address
    console.log("🔄 STX adresi backend formatına çevriliyor:", stxAddress)
    return stxAddress
  }
  return ""
}

// Backend'e kullanıcı kontrolü gönder
export const checkUserExistsWithStacks = async (stacksUser: StacksUser): Promise<any> => {
  try {
    const walletAddress = formatStacksAddressForBackend(stacksUser)

    if (!walletAddress) {
      console.error("❌ Geçerli STX adresi bulunamadı")
      return null
    }

    console.log("📤 Backend'e kullanıcı kontrolü gönderiliyor...")
    console.log("📍 Kontrol edilen STX adresi:", walletAddress)

    const response = await fetch("https://back.goktugtunc.com/is_exists_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet_address: walletAddress,
      }),
    })

    console.log("📥 Backend API yanıtı:", response.status, response.ok)

    if (response.ok) {
      const result = await response.json()
      console.log("📊 Backend API sonucu:", result)
      return result
    } else {
      console.error("❌ Backend API hatası:", response.status)
      return null
    }
  } catch (error) {
    console.error("❌ Backend API bağlantı hatası:", error)
    return null
  }
}

// Stacks kullanıcı verilerini localStorage'a kaydet
export const saveStacksUserData = (stacksUser: StacksUser, backendResult: any): void => {
  try {
    console.log("💾 Stacks kullanıcı verileri kaydediliyor...")
    console.log("🔗 Stacks User Data:", stacksUser)
    console.log("🏢 Backend Result:", backendResult)

    // STX adresini kaydet
    const stxAddress = formatStacksAddressForBackend(stacksUser)
    localStorage.setItem("stacks_address", stxAddress)
    console.log("📍 STX adresi kaydedildi:", stxAddress)

    // Tüm Stacks verilerini kaydet
    localStorage.setItem("stacks_user_data", JSON.stringify(stacksUser))
    console.log("👤 Stacks kullanıcı verileri kaydedildi")

    // Backend'den gelen JWT token'ı kaydet
    if (backendResult.token) {
      localStorage.setItem("jwt_token", backendResult.token)
      console.log("🔐 JWT token kaydedildi")
    }

    // Backend'den gelen kullanıcı bilgilerini kaydet
    if (backendResult.user) {
      // Kullanıcı bilgilerine STX adresini de ekle
      const userWithWallet = {
        ...backendResult.user,
        wallet_address: stxAddress,
        stx_address: stxAddress,
      }

      localStorage.setItem("user_info", JSON.stringify(userWithWallet))
      console.log("👤 Backend kullanıcı bilgileri kaydedildi:", userWithWallet)
    }

    // Eski wallet_address field'ını da güncelle (backward compatibility)
    localStorage.setItem("wallet_address", stxAddress)

    console.log("✅ Tüm kullanıcı verileri başarıyla kaydedildi")
  } catch (error) {
    console.error("❌ Kullanıcı verileri kaydedilirken hata:", error)
  }
}

// Stacks oturum verilerini temizle
export const clearStacksSession = (): void => {
  console.log("🧹 Stacks oturum verileri temizleniyor...")

  // Stacks bağlantısını kes
  disconnectStacksWallet()

  // localStorage'dan Stacks verilerini temizle
  localStorage.removeItem("stacks_address")
  localStorage.removeItem("stacks_user_data")
  localStorage.removeItem("jwt_token")
  localStorage.removeItem("user_info")
  localStorage.removeItem("wallet_address")

  console.log("✅ Tüm Stacks oturum verileri temizlendi")
}
