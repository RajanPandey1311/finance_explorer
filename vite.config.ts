import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api/tickers': {
        target: 'https://www.sec.gov',
        changeOrigin: true,
        rewrite: () => '/files/company_tickers.json',
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'finance test@finance.com');
          });
        }
      },
      '/api/company': {
        target: 'https://data.sec.gov',
        changeOrigin: true,
        rewrite: (path) => {
          const cik = new URL(path, 'http://localhost').searchParams.get('cik');
          return `/api/xbrl/companyfacts/CIK${cik}.json`;
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'finance test@finance.com');
          });
        }
      }
    }
  }
})
