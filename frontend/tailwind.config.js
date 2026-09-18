/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base Dark Palette
        'deep-space': '#03070D',
        'midnight': '#06101A',
        'deep-navy': '#081724',
        'panel-dark': '#0C1C2A',
        'panel-elevated': '#102536',

        // Primary Accent
        'electric-cyan': '#42E8D0',
        'aqua': '#55DDE0',

        // Secondary Accent
        'satellite-blue': '#4EA7FF',
        'aurora-blue': '#6D8DFF',

        // Secondary Highlight
        'aurora-violet': '#8B6CFF',
        'soft-violet': '#A477FF',

        // Environmental
        'emerald-env': '#35D6A1',
        'forest-env': '#43C98B',

        // Alerts
        'alert-warning': '#FFB454',
        'alert-critical': '#FF5C62',

        // Base space scale mapped to new dark palette
        space: {
          950: '#03070D',
          900: '#06101A',
          850: '#081724',
          800: '#0C1C2A',
          750: '#102536',
          700: '#172E42',
        },
        orbit: {
          cyan: '#42E8D0',
          emerald: '#35D6A1',
          amber: '#FFB454',
          crimson: '#FF5C62',
          violet: '#8B6CFF',
          blue: '#4EA7FF',
        },
        earth: {
          veg: '#35D6A1',
          water: '#4EA7FF',
          built: '#FFB454',
          crop: '#55DDE0',
          bare: '#A477FF',
          change: '#FF5C62',
          stable: '#64748B',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'radar': '0 0 25px -5px rgba(66, 232, 208, 0.2)',
        'panel': '0 12px 36px -8px rgba(3, 7, 13, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'panel-elevated': '0 20px 48px -12px rgba(3, 7, 13, 0.9), 0 0 24px -6px rgba(66, 232, 208, 0.15)',
        'glow-cyan': '0 0 20px rgba(66, 232, 208, 0.35)',
        'glow-blue': '0 0 20px rgba(78, 167, 255, 0.35)',
        'glow-violet': '0 0 20px rgba(139, 108, 255, 0.35)',
        'glow-crimson': '0 0 20px rgba(255, 92, 98, 0.35)',
        'glow-emerald': '0 0 20px rgba(53, 214, 161, 0.35)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle at 1px 1px, rgba(66, 232, 208, 0.08) 1px, transparent 0)",
        'radar-concentric': "radial-gradient(circle, rgba(66, 232, 208, 0.06) 0%, rgba(66, 232, 208, 0) 70%)",
        'gradient-radial-earth': "radial-gradient(circle at 50% 120%, rgba(78, 167, 255, 0.18) 0%, rgba(66, 232, 208, 0.08) 40%, transparent 75%)",
      },
    },
  },
  plugins: [],
}
