#!/bin/bash

# Aura Frontend Setup Verification Script

echo "🔍 Verifying Aura Frontend Setup..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from /Users/josue/Aura/frontend/"
    exit 1
fi

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

# Check npm
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check file structure
echo ""
echo "📁 Checking file structure..."

files=(
    "package.json"
    "vite.config.js"
    "tailwind.config.js"
    "index.html"
    ".env.example"
    "src/main.jsx"
    "src/App.jsx"
    "src/index.css"
    "src/pages/Home.jsx"
    "src/pages/Verify.jsx"
    "src/pages/Register.jsx"
    "src/pages/Transfer.jsx"
    "src/components/Header.jsx"
    "src/components/Footer.jsx"
    "src/components/WalletConnect.jsx"
    "src/components/VerificationResult.jsx"
    "src/components/CustodyTimeline.jsx"
    "src/hooks/useContract.js"
    "src/utils/api.js"
    "src/utils/constants.js"
)

missing_files=0
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        ((missing_files++))
    fi
done

if [ $missing_files -gt 0 ]; then
    echo ""
    echo "❌ $missing_files file(s) missing"
    exit 1
fi

# Check .env file
echo ""
echo "🔐 Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"

    # Check for required variables
    required_vars=("VITE_API_URL" "VITE_CONTRACT_ADDRESS" "VITE_WALLETCONNECT_PROJECT_ID")
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env; then
            value=$(grep "^${var}=" .env | cut -d '=' -f2)
            if [ -z "$value" ] || [ "$value" = "YOUR_PROJECT_ID" ]; then
                echo "⚠️  $var is not configured"
            else
                echo "✅ $var is configured"
            fi
        else
            echo "❌ $var not found in .env"
        fi
    done
else
    echo "⚠️  .env file not found. Run: cp .env.example .env"
fi

# Check node_modules
echo ""
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "⚠️  node_modules not found. Run: npm install"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ File structure verification complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm install (if not done)"
echo "2. Configure .env file with your values"
echo "3. Run: npm run dev"
echo ""
echo "📖 See SETUP.md for detailed instructions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
