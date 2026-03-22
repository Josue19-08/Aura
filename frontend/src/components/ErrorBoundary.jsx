import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React error', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void text-white flex items-center justify-center px-6">
          <div className="card max-w-lg text-center">
            <div className="text-5xl mb-4">!</div>
            <h1 className="text-h2 font-display mb-3">Aura hit an unexpected error</h1>
            <p className="text-fog mb-6">
              Refresh the page to recover. If the problem persists, retry the last action after reconnecting your wallet or API.
            </p>
            <button type="button" onClick={this.handleReload} className="btn-primary">
              Reload application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
export default ErrorBoundary
