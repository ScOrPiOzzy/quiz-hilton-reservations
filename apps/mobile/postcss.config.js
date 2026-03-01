/**
 * PostCSS 配置
 * 用于 Tailwind CSS 和其他 PostCSS 插件
 */

module.exports = {
  plugins: {
    // Tailwind CSS v4 (已内置 autoprefixer)
    '@tailwindcss/postcss': {
      // 启用 Tailwind 的所有功能
      base: true,
      components: true,
      utilities: true
    }
  }
}
