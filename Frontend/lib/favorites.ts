// Favori ürünleri localStorage'da yönetmek için utility fonksiyonları

export interface FavoriteItem {
  id: number
  title: string
  price: string
  image: string
  addedAt: string
}

// Favorileri localStorage'dan al
export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === "undefined") return []

  try {
    const favorites = localStorage.getItem("chaingo_favorites")
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error("Favoriler alınırken hata:", error)
    return []
  }
}

// Favorileri localStorage'a kaydet
export const saveFavorites = (favorites: FavoriteItem[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("chaingo_favorites", JSON.stringify(favorites))
  } catch (error) {
    console.error("Favoriler kaydedilirken hata:", error)
  }
}

// Ürünü favorilere ekle
export const addToFavorites = (item: Omit<FavoriteItem, "addedAt">): boolean => {
  try {
    const favorites = getFavorites()

    // Zaten favorilerde mi kontrol et
    if (favorites.some((fav) => fav.id === item.id)) {
      return false // Zaten favorilerde
    }

    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: new Date().toISOString(),
    }

    favorites.push(newFavorite)
    saveFavorites(favorites)
    return true
  } catch (error) {
    console.error("Favoriye eklenirken hata:", error)
    return false
  }
}

// Ürünü favorilerden çıkar
export const removeFromFavorites = (productId: number): boolean => {
  try {
    const favorites = getFavorites()
    const filteredFavorites = favorites.filter((fav) => fav.id !== productId)

    if (filteredFavorites.length === favorites.length) {
      return false // Zaten favorilerde değildi
    }

    saveFavorites(filteredFavorites)
    return true
  } catch (error) {
    console.error("Favorilerden çıkarılırken hata:", error)
    return false
  }
}

// Ürün favorilerde mi kontrol et
export const isFavorite = (productId: number): boolean => {
  try {
    const favorites = getFavorites()
    return favorites.some((fav) => fav.id === productId)
  } catch (error) {
    console.error("Favori kontrolü yapılırken hata:", error)
    return false
  }
}

// Favori sayısını al
export const getFavoriteCount = (): number => {
  return getFavorites().length
}
