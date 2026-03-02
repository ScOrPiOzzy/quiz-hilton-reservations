export const storage = {
  setItem: (key: string, value: string): void => {
    localStorage.setItem(key, value)
  },
  getItem: (key: string): string | null => {
    return localStorage.getItem(key)
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key)
  },
  clear: (): void => {
    localStorage.clear()
  },
}

export const tokenKey = 'hilton_token'
export const userKey = 'hilton_user'

export const getToken = (): string | null => {
  return storage.getItem(tokenKey)
}

export const setToken = (token: string): void => {
  storage.setItem(tokenKey, token)
}

export const removeToken = (): void => {
  storage.removeItem(tokenKey)
}

export const getUser = (): string | null => {
  return storage.getItem(userKey)
}

export const setUser = (user: string): void => {
  storage.setItem(userKey, user)
}

export const removeUser = (): void => {
  storage.removeItem(userKey)
}
