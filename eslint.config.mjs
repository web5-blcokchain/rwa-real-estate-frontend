import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'style/comma-dangle': ['warn', 'never']
  },

  jsonc: {
    overrides: {
      'jsonc/comma-dangle': ['warn', 'never']
    }
  },

  react: true,
  unocss: true
})
