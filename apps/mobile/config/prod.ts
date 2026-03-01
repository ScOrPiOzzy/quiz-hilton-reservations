/**
 * 生产环境配置
 * 生产环境使用生产服务器配置，优化构建产物
 */

const prodConfig = {
  // 生产环境 API 地址
  API_BASE_URL: 'https://api.hilton-reservations.com',

  // 生产环境禁用 sourceMap（减少包体积）
  sourceMap: false,

  // 生产环境禁用热更新
  enableHotReload: false,

  // 生产环境禁用调试模式
  debug: false,

  // 生产环境日志级别
  logLevel: 'error',

  // 生产环境启用压缩
  compress: true,

  // 生产环境启用 Tree Shaking
  treeShaking: true
}

export default prodConfig
