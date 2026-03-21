# Aura Frontend

React-based frontend for the Aura product traceability system.

## Features

- Product verification via QR code scanning
- Product registration (wallet required, manufacturer role)
- Custody transfer management (wallet required)
- Real-time blockchain interaction
- Responsive design with TailwindCSS
- Web3 wallet integration via RainbowKit

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **RainbowKit + wagmi** - Web3 wallet connection
- **Framer Motion** - Animations
- **React Router** - Navigation
- **QR Scanner** - QR code scanning
- **Axios** - API client

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=<your-contract-address>
VITE_WALLETCONNECT_PROJECT_ID=<your-project-id>
```

4. Start development server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_CONTRACT_ADDRESS` | ProductRegistry contract address | Yes |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID | Yes |
| `VITE_IPFS_GATEWAY` | IPFS gateway URL | No |

## Project Structure

```
src/
├── components/       # React components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── WalletConnect.jsx
│   ├── VerificationResult.jsx
│   └── CustodyTimeline.jsx
├── pages/           # Route pages
│   ├── Home.jsx
│   ├── Verify.jsx
│   ├── Register.jsx
│   └── Transfer.jsx
├── hooks/           # Custom React hooks
│   └── useContract.js
├── utils/           # Utilities
│   ├── api.js
│   └── constants.js
├── App.jsx          # Main app component
├── main.jsx         # React entry point
└── index.css        # Global styles
```

## User Flows

### Verify Product (No Wallet Required)
1. Navigate to `/verify`
2. Scan QR code or enter product ID
3. View verification result with custody history

### Register Product (Wallet Required)
1. Connect wallet
2. Navigate to `/register`
3. Fill product details
4. Upload certificates/images to IPFS
5. Sign transaction to register on blockchain
6. Download QR code

### Transfer Custody (Wallet Required)
1. Connect wallet
2. Navigate to `/transfer`
3. Enter product ID
4. Enter new custodian address and location
5. Sign transaction to transfer custody

## Build

```bash
npm run build
```

Built files will be in `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Or deploy to any static hosting service by uploading the `dist/` folder.

## Brand Guidelines

Colors, typography, and design system follow the brand guidelines in `/docs/brand/`.

## License

MIT
