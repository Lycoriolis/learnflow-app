/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Main theme colors
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        cherry: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Semantic colors
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1a1a1a',
          secondary: '#f8fafc',
          'secondary-dark': '#2d2d2d'
        },
        text: {
          DEFAULT: '#1f2937',
          secondary: '#4b5563',
          light: '#f9fafb',
          'secondary-light': '#d1d5db',
          cherry: '#be123c'
        },
        math: {
          bg: 'rgba(244, 244, 252, 0.8)',
          'bg-dark': 'rgba(30, 41, 59, 0.5)',
          text: '#1e293b',
          'text-dark': '#e2e8f0'
        }
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        math: ['KaTeX_Math', 'STIXGeneral', 'Georgia', 'serif']
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.text.DEFAULT'),
            '--tw-prose-headings': theme('colors.text.DEFAULT'),
            '--tw-prose-lead': theme('colors.text.secondary'),
            '--tw-prose-links': theme('colors.cherry.600'),
            '--tw-prose-bold': theme('colors.text.DEFAULT'),
            '--tw-prose-counters': theme('colors.text.secondary'),
            '--tw-prose-bullets': theme('colors.cherry.400'),
            '--tw-prose-hr': theme('colors.gray.200'),
            '--tw-prose-quotes': theme('colors.text.DEFAULT'),
            '--tw-prose-quote-borders': theme('colors.cherry.300'),
            '--tw-prose-captions': theme('colors.text.secondary'),
            '--tw-prose-code': theme('colors.cherry.700'),
            '--tw-prose-pre-code': theme('colors.text.light'),
            '--tw-prose-pre-bg': theme('colors.gray.800'),
            '--tw-prose-th-borders': theme('colors.gray.300'),
            '--tw-prose-td-borders': theme('colors.gray.200'),
            '--tw-prose-invert-body': theme('colors.text.light'),
            '--tw-prose-invert-headings': theme('colors.text.light'),
            '--tw-prose-invert-lead': theme('colors.text.secondary-light'),
            '--tw-prose-invert-links': theme('colors.cherry.400'),
            '--tw-prose-invert-bold': theme('colors.text.light'),
            '--tw-prose-invert-counters': theme('colors.text.secondary-light'),
            '--tw-prose-invert-bullets': theme('colors.cherry.500'),
            '--tw-prose-invert-hr': theme('colors.gray.700'),
            '--tw-prose-invert-quotes': theme('colors.text.light'),
            '--tw-prose-invert-quote-borders': theme('colors.cherry.600'),
            '--tw-prose-invert-captions': theme('colors.text.secondary-light'),
            '--tw-prose-invert-code': theme('colors.cherry.400'),
            '--tw-prose-invert-pre-code': theme('colors.gray.300'),
            '--tw-prose-invert-pre-bg': theme('colors.gray.900'),
            '--tw-prose-invert-th-borders': theme('colors.gray.600'),
            '--tw-prose-invert-td-borders': theme('colors.gray.700'),
            maxWidth: 'none',
            'h1, h2, h3, h4': {
              fontWeight: '600',
              fontFamily: theme('fontFamily.jakarta').join(', '),
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            '.math-display': {
              margin: '1rem 0',
              'overflow-x': 'auto',
              'overflow-y': 'hidden'
            },
            '.math-inline': {
              display: 'inline-block',
              'vertical-align': 'middle',
              padding: '0 0.2em'
            }
          }
        },
        lg: {
          css: {
            fontSize: '1.125rem',
            lineHeight: '1.75',
          }
        }
      }),
      borderRadius: {
        'squircle': '24px',
        'squircle-sm': '18px',
        'squircle-lg': '28px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 25px rgba(0, 0, 0, 0.04), 0 0 10px rgba(0, 0, 0, 0.02)',
        'math': '0 2px 8px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    {
      pattern: /^(bg|text|border|ring|from|to)-(primary|secondary|surface|math|cherry|text)-\d{2,3}$/,
    },
    'squircle',
    'squircle-sm',
    'squircle-lg',
    'math-display',
    'math-inline'
  ]
};
