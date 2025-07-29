import plugin from 'tailwindcss/plugin'

import { colors, rem, spacing } from './src/shared/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.33, 1, 0.68, 1)'
      },
      transitionDuration: {
        DEFAULT: '0.4s'
      },
      colors: colors,
      boxShadow: {
        custom: '0px 0px 15px 0px #e1e1e1'
      },
      screens: {
        // desktop: 1201px и выше
        desktop: { min: '1201px' },
        // devices: 0-1200px (используется max-width подход)
        devices: { max: '1200px' },
        // tablet: 768-1200px
        tablet: { min: '768px', max: '1200px' },
        // mobile: 0-767px
        mobile: { max: '767px' }
      },
      spacing: spacing
    }
  },
  corePlugins: {
    container: false, // Отключаем встроенный контейнер
  },
  plugins: [
    plugin(function ({ theme, addUtilities }) {
      const newUtilities = {
        // Показывать только на desktop (1201px+)
        '.desktop': {
          '@media (max-width: 1200px)': {
            display: 'none !important'
          }
        },
        // Показывать только на mobile (0-767px)
        '.mobile': {
          '@media (min-width: 768px)': {
            display: 'none !important'
          }
        },
        // Показывать только на tablet (768-1200px)
        '.tablet': {
          '@media (max-width: 767px)': {
            display: 'none !important'
          },
          '@media (min-width: 1201px)': {
            display: 'none !important'
          }
        },
        // Показывать только на devices (0-1200px)
        '.devices': {
          '@media (min-width: 1201px)': {
            display: 'none !important'
          }
        },
        '.mock': {
          background: '#ff3333 !important', 
          borderRadius: '4px !important',
          display: 'flex !important',
          alignItems: 'center !important',
          justifyContent: 'center !important',
          color: '#fff !important',         
          fontSize: '16px !important',
          fontWeight: '500 !important',
          textAlign: 'center !important',
          border: '1px dashed #ccc !important'
        }
      }

      addUtilities(newUtilities, ['responsive'] as any)
    })
  ]
}
