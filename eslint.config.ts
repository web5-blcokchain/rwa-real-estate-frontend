import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'

export default antfu({
  gitignore: true,
  react: true,
  jsx: true,
  vue: false,
  yaml: false,
  markdown: false,
  astro: false,
  solid: false,
  svelte: false,
  unocss: true
}, {
  ignores: [
    'dist',
    'node_modules',
    '.vscode',
    'public',
    'src/assets',
    '.gitignore',
    'scripts',
    'README.md',
    'bun.lockb',
    'src/components/ui',
    'src/routeTree.gen.ts'
  ]
}, {
  rules: {
    'no-console': 'off',
    'ts/no-use-before-define': 'off',
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'style/comma-dangle': ['warn', 'never']
  }
}, {
  files: ['tailwind.config.js', 'postcss.config.js'],
  rules: {
    'import/no-anonymous-default-export': 'off'
  }
}, ...pluginRouter.configs['flat/recommended'], ...pluginQuery.configs['flat/recommended'])
