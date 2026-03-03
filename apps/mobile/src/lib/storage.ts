const isClient = typeof window !== 'undefined';

export const storage = {
  setItem: (key: string, value: string): void => {
    if (!isClient) return;
    localStorage.setItem(key, value);
  },
  getItem: (key: string): string | null => {
    if (!isClient) return null;
    return localStorage.getItem(key);
  },
  removeItem: (key: string): void => {
    if (!isClient) return;
    localStorage.removeItem(key);
  },
  clear: (): void => {
    if (!isClient) return;
    localStorage.clear();
  },
};

export const tokenKey = 'hilton_token';
export const userKey = 'hilton_user';

export const getToken = (): string | null => {
  return storage.getItem(tokenKey);
};

export const setToken = (token: string): void => {
  storage.setItem(tokenKey, token);
};

export const removeToken = (): void => {
  storage.removeItem(tokenKey);
};

export const getUser = (): string | null => {
  return storage.getItem(userKey);
};

export const getUserId = (): string | null => {
  const userStr = getUser();
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.id || null;
  } catch {
    return null;
  }
};

export const setUser = (user: string): void => {
  storage.setItem(userKey, user);
};

export const removeUser = (): void => {
  storage.removeItem(userKey);
};
