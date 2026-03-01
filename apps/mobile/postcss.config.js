/**
 * PostCSS 配置
 * 用于 Tailwind CSS 和其他 PostCSS 插件
 */

module.exports = {
  plugins: {
    // Tailwind CSS v4
    '@tailwindcss/postcss': {
      // 启用 Tailwind 的所有功能
      base: true,
      components: true,
      utilities: true
    },
    // 自动添加浏览器前缀
    autoprefixer: {
      overrideBrowserslist: [
        'iOS >= 9',
        'Android >= 5',
        'chrome >= 60',
        'firefox >= 60',
        'safari >= 10',
        'edge >= 60'
      ]
    }
  }
}
