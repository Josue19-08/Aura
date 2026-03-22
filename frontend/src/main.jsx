import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { avalancheFuji, avalanche } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import ErrorBoundary from '@components/ErrorBoundary'

const config = getDefaultConfig({
  appName: 'Aura',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [avalancheFuji, avalanche],
  ssr: false,
})

const queryClient = new QueryClient()

const customTheme = darkTheme({
  accentColor: '#00E5CC',
  accentColorForeground: '#0A0A0F',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
})

customTheme.colors.modalBackground = '#1C1C2E'
customTheme.colors.modalBorder = '#00E5CC'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={customTheme}>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontFamily: 'DM Sans, sans-serif',
                },
              }}
            />
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
