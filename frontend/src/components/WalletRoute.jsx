import { Suspense, lazy } from 'react'
import { LoadingOverlay } from '@components/LoadingStates'

const WalletProviderShell = lazy(() => import('@components/WalletProviderShell'))

export default function WalletRoute({ children }) {
  return (
    <Suspense fallback={<LoadingOverlay show label="Loading wallet tools..." />}>
      <WalletProviderShell>{children}</WalletProviderShell>
    </Suspense>
  )
}
