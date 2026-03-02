export const platform = {
  isWeChat: (): boolean => {
    // @ts-ignore
    return typeof wx !== 'undefined' && wx.getSystemInfoSync
  },
  isH5: (): boolean => {
    return typeof window !== 'undefined' && !platform.isWeChat()
  },
  getPlatform: (): 'h5' | 'wechat' => {
    return platform.isWeChat() ? 'wechat' : 'h5'
  },
}

export const getEnv = (): string => {
  return process.env.NODE_ENV || 'development'
}

export const isDev = (): boolean => {
  return getEnv() === 'development'
}

export const isProd = (): boolean => {
  return getEnv() === 'production'
}
