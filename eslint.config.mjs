import antfu from '@antfu/eslint-config'
import pluginNext from '@next/eslint-plugin-next'

const nextConfig = [
  {
    plugins: {
      '@next/next': pluginNext
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...pluginNext.configs.recommended.rules
    }
  }
]

export default antfu(
  {
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
  },
  nextConfig
)
