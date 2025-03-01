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
        'text-secondary': '#8d909a',
        'border': '#4F5054'
      }
    ),
    breakpoints
  },
  shortcuts: [
    [/^clickable(-.*)?$/, ([, scale]) => `cursor-pointer transition active:scale${scale || '-95'}`],

    ['pr', 'relative'],
    ['pa', 'absolute'],
    ['pf', 'fixed'],
    ['ps', 'sticky'],

    // position layout
    ['pxc', 'pa left-1/2 -translate-x-1/2'],
    ['pyc', 'pa top-1/2 -translate-y-1/2'],
    ['pcc', 'pxc pyc'],

    // flex layout
    ['fcc', 'flex justify-center items-center'],
    ['fccc', 'fcc flex-col'],
    ['fxc', 'flex justify-center'],
    ['fyc', 'flex items-center'],
    ['fs', 'flex justify-start'],
    ['fsc', 'flex justify-start items-center'],
    ['fse', 'flex justify-start items-end'],
    ['fe', 'flex justify-end'],
    ['fec', 'flex justify-end items-center'],
    ['fb', 'flex justify-between'],
    ['fbc', 'flex justify-between items-center'],
    ['fa', 'flex justify-around'],
    ['fac', 'flex justify-around items-center'],
    ['fw', 'flex justify-wrap'],
    ['fwr', 'flex justify-wrap-reverse']
  ],
  presets: [
    presetWind3(),
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
      './{app,layouts,components}/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'
    ]
  }
})
