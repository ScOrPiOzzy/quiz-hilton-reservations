/**
 * ESLint 配置
 * 基于 eslint-config-taro 进行配置
 */

module.exports = {
  extends: ['taro'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    useJSXTextNode: true,
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    // 自定义规则
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off'
  }
}
