import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate border-t border-fog/10 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/aura_logo.png"
                alt="Aura Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display font-bold text-2xl text-white">Aura</span>
            </div>
            <p className="text-fog text-sm">
              Immutable product traceability powered by blockchain technology.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <FooterLink to="/verify">Verify</FooterLink>
              <FooterLink to="/register">Register</FooterLink>
              <FooterLink to="/transfer">Transfer</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink to="/docs">Documentation</FooterLink>
              <FooterLink to="/api">API Reference</FooterLink>
              <FooterLink to="/github" external>GitHub</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/security">Security</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-fog/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-fog text-sm">
            © {currentYear} Aura. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://avax.network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fog hover:text-signal transition-colors text-sm"
            >
              Powered by Avalanche
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, external, children }) {
  if (external) {
    return (
      <li>
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fog hover:text-signal transition-colors text-sm"
        >
          {children}
        </a>
      </li>
    )
  }

  return (
    <li>
      <Link
        to={to}
        className="text-fog hover:text-signal transition-colors text-sm"
      >
        {children}
      </Link>
    </li>
  )
}
