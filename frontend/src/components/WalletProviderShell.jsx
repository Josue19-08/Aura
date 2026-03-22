import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { avalancheFuji, avalanche } from 'wagmi/chains'

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

export default function WalletProviderShell({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
