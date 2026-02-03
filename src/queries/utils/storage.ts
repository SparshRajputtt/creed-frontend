//@ts-nocheck
// Token storage utilities
export const authStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
  },

  setAccessToken: (token: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("accessToken", token)
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refreshToken")
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("refreshToken", token)
  },

  setTokens: (accessToken: string, refreshToken?: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("accessToken", accessToken)
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    }
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  },

  hasValidToken: (): boolean => {
    if (typeof window === "undefined") return false
    const token = localStorage.getItem("accessToken")
    return !!token
  },
}

// User data storage
export const userStorage = {
  getUser: () => {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  },

  setUser: (user: any) => {
    if (typeof window === "undefined") return
    localStorage.setItem("user", JSON.stringify(user))
  },

  clearUser: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("user")
  },
}

// Cart storage for persistence
export const cartStorage = {
  getCart: () => {
    if (typeof window === "undefined") return null
    const cartData = localStorage.getItem("cart")
    return cartData ? JSON.parse(cartData) : null
  },

  setCart: (cart: any) => {
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(cart))
  },

  clearCart: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("cart")
  },
}
