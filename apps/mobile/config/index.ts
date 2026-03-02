import { defineConfig, type UserConfigExport } from '@tarojs/cli'

const config: UserConfigExport = defineConfig({
  projectName: 'hilton-reservations-mobile',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-framework-react'
  ],
  alias: {
    react: '@tarojs/react',
  },
  framework: 'react',
  h5: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false
      }
    }
  }
})

export default config
