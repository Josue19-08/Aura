import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('framer-motion')) {
            return 'motion'
          }

          if (id.includes('react-router')) {
            return 'router'
          }

          if (id.includes('qr-scanner') || id.includes('qrcode')) {
            return 'qr'
          }

          if (id.includes('@rainbow-me')) {
            return 'rainbowkit'
          }

          if (id.includes('wagmi')) {
            return 'wagmi'
          }

          if (id.includes('viem')) {
            return 'viem'
          }

          if (id.includes('@walletconnect') || id.includes('@reown')) {
            return 'walletconnect'
          }

          if (id.includes('@coinbase')) {
            return 'coinbase'
          }

          if (id.includes('metamask')) {
            return 'metamask'
          }

          if (id.includes('@tanstack')) {
            return 'query'
          }

          return 'vendor'
        },
      },
    },
  },
})
