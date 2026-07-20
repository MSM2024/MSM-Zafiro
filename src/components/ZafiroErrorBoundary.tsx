'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ZafiroErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, info)
    }
  }

  handleRecovery = () => {
    this.setState({ hasError: false, error: null })
  }

  handleResetCache = () => {
    if ('caches' in window) {
      caches.keys().then((keys) => {
        const zafiroCaches = keys.filter((k) => k.startsWith('zafiro-'))
        return Promise.all(zafiroCaches.map((k) => caches.delete(k)))
      }).then(() => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
        }
        window.location.reload()
      })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="max-w-md w-full text-center">
            <svg viewBox="0 0 100 120" className="w-16 h-20 mx-auto mb-6" style={{ filter: 'drop-shadow(0 0 20px rgba(0,217,255,0.2))' }}>
              <polygon points="50,2 26,26 50,36" fill="#1a4b8c" opacity="0.9"/>
              <polygon points="50,2 74,26 50,36" fill="#1e3a5f" opacity="0.85"/>
              <polygon points="8,36 26,26 32,41 12,44" fill="#2563eb" opacity="0.8"/>
              <polygon points="92,36 74,26 68,41 88,44" fill="#7c3aed" opacity="0.7"/>
              <polygon points="12,44 32,41 50,44 68,41 88,44 92,40 92,48 88,51 68,49 50,51 32,49 12,51 8,48 8,40" fill="#6366f1" opacity="0.8"/>
              <polygon points="12,48 32,49 50,108 50,118" fill="#2563eb" opacity="0.8"/>
              <polygon points="88,48 68,49 50,108 50,118" fill="#7c3aed" opacity="0.75"/>
              <polygon points="44,113 50,126 56,113 50,118" fill="#a855f7" opacity="0.8"/>
            </svg>

            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              ZAFIRO
            </h1>
            <p className="text-sm mb-6" style={{ color: '#A1A1AA' }}>
              Algo sali&oacute; mal al cargar la aplicaci&oacute;n.
            </p>

            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={this.handleRecovery}
                className="px-6 py-2.5 rounded-full text-sm font-mono tracking-wider cursor-pointer transition-all"
                style={{
                  border: '1px solid rgba(0,255,255,0.3)',
                  color: '#00FFFF',
                  background: 'linear-gradient(135deg, rgba(0,217,255,0.08), rgba(0,0,0,0.2))',
                }}
              >
                REINTENTAR
              </button>

              <button
                onClick={this.handleResetCache}
                className="px-6 py-2 rounded-full text-xs font-mono tracking-wider cursor-pointer transition-all"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.4)',
                  background: 'transparent',
                }}
              >
                RESTABLECER CACH&Eacute; DE ZAFIRO
              </button>
            </div>

            {this.state.error && (
              <details className="mt-6 text-left cursor-pointer">
                <summary className="text-xs text-zinc-600 hover:text-zinc-500">Detalle t&eacute;cnico</summary>
                <pre className="mt-2 text-[10px] p-3 rounded-lg overflow-auto max-h-24" style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #1a1a2e',
                  color: '#ff6b6b',
                }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
