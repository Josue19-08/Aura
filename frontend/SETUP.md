# Aura Frontend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   cd /Users/josue/Aura/frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file:**
   ```env
   # Backend API (running on port 5000)
   VITE_API_URL=http://localhost:5000/api

   # Smart contract address (from deployment)
   VITE_CONTRACT_ADDRESS=0x...

   # WalletConnect Project ID
   # Get one at https://cloud.walletconnect.com
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id

   # Optional: Custom IPFS gateway
   VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will open at http://localhost:5173

## Getting WalletConnect Project ID

1. Go to https://cloud.walletconnect.com
2. Sign up or log in
3. Create a new project
4. Copy the Project ID
5. Add to `.env` as `VITE_WALLETCONNECT_PROJECT_ID`

## File Structure

```
frontend/
├── public/
│   └── favicon.svg              # App favicon
├── src/
│   ├── components/              # Reusable components
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Footer.jsx          # Footer
│   │   ├── WalletConnect.jsx   # RainbowKit wallet button
│   │   ├── VerificationResult.jsx  # Verification display
│   │   └── CustodyTimeline.jsx     # Timeline visualization
│   ├── pages/                  # Route pages
│   │   ├── Home.jsx           # Landing page
│   │   ├── Verify.jsx         # Product verification (public)
│   │   ├── Register.jsx       # Product registration (wallet)
│   │   └── Transfer.jsx       # Custody transfer (wallet)
│   ├── hooks/
│   │   └── useContract.js     # Contract interaction hook
│   ├── utils/
│   │   ├── api.js            # API client
│   │   └── constants.js      # Contract ABI & constants
│   ├── App.jsx               # Main app with routes
│   ├── main.jsx              # React + RainbowKit setup
│   └── index.css             # Global styles
├── index.html                # HTML template
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind theme
├── postcss.config.js       # PostCSS config
└── .env.example            # Environment template
```

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page | No |
| `/verify` | Verify product | No |
| `/verify/:id` | Verify specific product | No |
| `/register` | Register new product | Yes (Wallet + MANUFACTURER_ROLE) |
| `/transfer` | Transfer custody | Yes (Wallet) |

## Brand Colors

The app uses the Aura brand palette:

- **Void** `#0A0A0F` - Main background
- **Signal** `#00E5CC` - Primary accent
- **Caution** `#FF6B35` - Alerts/warnings
- **Slate** `#1C1C2E` - Secondary backgrounds
- **Fog** `#8888AA` - Secondary text
- **White** `#F0F0F5` - Primary text

## Typography

- **Space Grotesk** - Display/Hero text
- **IBM Plex Mono** - Technical data
- **DM Sans** - Interface/Body text

Fonts are loaded via Google Fonts in `index.html`.

## Key Features

### 1. Public Verification (No Wallet)
- QR code scanning with camera
- Manual product ID entry
- Real-time verification status
- Complete custody history display
- Counterfeit detection warnings

### 2. Product Registration (Wallet Required)
- Connect wallet via RainbowKit
- Upload metadata to IPFS
- Register on blockchain
- Generate QR codes
- Download printable QR codes

### 3. Custody Transfer (Wallet Required)
- Load product by ID
- Verify current custody
- Transfer to new custodian
- Add location notes
- View updated custody chain

## Dependencies

### Core
- `react` `react-dom` - UI framework
- `react-router-dom` - Routing
- `framer-motion` - Animations

### Web3
- `@rainbow-me/rainbowkit` - Wallet connection UI
- `wagmi` - React hooks for Ethereum
- `viem` - Ethereum library
- `@tanstack/react-query` - Data fetching

### Utilities
- `axios` - HTTP client
- `qr-scanner` - QR code scanning
- `qrcode` - QR code generation

### Styling
- `tailwindcss` - Utility-first CSS
- `autoprefixer` - CSS vendor prefixing

### Dev Tools
- `vite` - Build tool
- `@vitejs/plugin-react` - React support
- `eslint` - Code linting

## Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Building for Production

1. **Set production environment variables:**
   ```env
   VITE_API_URL=https://api.aura.app/api
   VITE_CONTRACT_ADDRESS=0x... (mainnet address)
   VITE_WALLETCONNECT_PROJECT_ID=...
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy `dist/` folder to:**
   - Vercel (recommended)
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting

## Deployment to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Add environment variables in Vercel dashboard**

## Troubleshooting

### Wallet Not Connecting
- Check WalletConnect Project ID is valid
- Clear browser cache
- Try different wallet

### Contract Calls Failing
- Verify contract address is correct
- Check you're on correct network (Fuji/Mainnet)
- Ensure wallet has AVAX for gas

### QR Scanner Not Working
- Grant camera permissions
- Use HTTPS (required for camera access)
- Try different browser

### IPFS Upload Failing
- Check backend API is running
- Verify web3.storage token is configured
- Check file size limits

## Development Tips

1. **Hot Module Replacement:** Vite provides instant updates during development

2. **Path Aliases:** Use `@/` for cleaner imports:
   ```js
   import Header from '@components/Header'
   import { api } from '@utils/api'
   ```

3. **Component Patterns:** All components follow brand guidelines from `/docs/brand/`

4. **Testing Verification:** Use `/verify/1` to test with product ID 1

## API Integration

The frontend communicates with the backend API for:
- Product verification (includes suspicious detection)
- IPFS metadata upload
- Product data fetching

Direct blockchain calls are made for:
- Product registration
- Custody transfers
- On-chain verification

## Security Notes

- Never commit `.env` file
- Always validate user input
- Use HTTPS in production
- Keep dependencies updated
- Audit smart contract interactions

## Support

For issues or questions:
- Check backend logs: `/Users/josue/Aura/backend/`
- Review smart contract: `/Users/josue/Aura/contracts/`
- See architecture docs: `/Users/josue/Aura/docs/architecture/`
