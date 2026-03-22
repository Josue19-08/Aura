import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-void">
          <div className="max-w-md p-8 bg-slate/40 backdrop-blur-xl text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Oops! Something Went Wrong
            </h2>
            <p className="text-fog/80 mb-6">
              We encountered an unexpected error. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-signal/10 hover:bg-signal/20 transition-colors duration-300"
            >
              <span className="text-signal font-medium">Refresh Page</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
