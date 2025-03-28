import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import lodashImports from 'lodash-imports'
import unocss from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgr from 'vite-plugin-svgr'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    svgr(),
    unocss(),
    createSvgIconsPlugin({
      iconDirs: [r('src/assets/icons')],
      symbolId: 'icon-[name]'
    }),
    autoImport({
      imports: [
        'react',
        'react-i18next',
        {
          'react-toastify': ['toast'],
          'buffer': ['Buffer']
        },
        {
          '@/utils/style': ['cn'],
          '@/components/utils/svg-icon': ['SvgIcon'],
          '@/components/utils/waiting': ['Waiting'],
          '@/i18n': [['default', 'i18n']],
          '@/utils/copy': ['copy']
        },
        lodashImports()
      ],
      dts: r('.auto-imports/auto-imports.d.ts')
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://adm.usdable.com/api/', // dev
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      '/images': {
        target: 'https://adm.usdable.com/', // dev
        changeOrigin: true,
        rewrite: path => path.replace(/^\/images/, '')
      }
    }
  }
})
