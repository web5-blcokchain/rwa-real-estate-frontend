import type { PresetOrFactoryAwaitable } from 'unocss'
import defu from 'defu'

import { unoColors } from 'uno-colors'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

import { presetUseful } from 'unocss-preset-useful'

const breakpoints = {
  'xs': '320px', // Extra small devices (e.g. phones)
  'sm': '480px', // Small devices (e.g. phones in landscape)
  'md': '768px', // Medium devices (e.g. tablets)
  'lg': '1024px', // Large devices (e.g. desktops)
  'xl': '1280px', // Extra large devices (e.g. large desktops)
  '2xl': '1536px', // 2x large devices (e.g. large monitors)
  '3xl': '1920px' // 3x large devices (e.g. ultra-wide monitors)
}

export default defineConfig({
  theme: {
    colors: defu(
      unoColors({
        primary: '#f0b90b'
      }),
      {
        'background': '#181a1e',
        'background-secondary': '#242933',
        'text': '#ffffff',
        'text-secondary': '#8d909a'
      }
    ),
    breakpoints
  },
  shortcuts: [
    [/^clickable(-.*)?$/, ([, scale]) => `cursor-pointer transition active:scale${scale || '-95'}`]
  ],
  presets: [
    presetWind3(),
    presetUseful() as PresetOrFactoryAwaitable<object>,
    presetAttributify(),
    presetIcons({
      scale: 1.2
    }),
    presetTypography()
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ],
  content: {
    filesystem: [
      '**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'
    ]
  }
})
