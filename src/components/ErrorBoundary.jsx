import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('APP ERROR', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-black text-white p-6">
          <p className="uppercase tracking-[0.3em] text-xs text-red-400 mb-4">
            Erreur front
          </p>

          <h1 className="text-2xl mb-4">
            Le rendu de cette page a planté.
          </h1>

          <pre className="whitespace-pre-wrap text-xs text-slate-300 bg-white/5 border border-white/10 rounded-2xl p-4">
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </main>
      )
    }

    return this.props.children
  }
}
