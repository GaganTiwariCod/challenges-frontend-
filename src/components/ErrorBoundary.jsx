import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false, error: null}
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, error}
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '40px 20px', maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 16, border: '1px solid #E6E8F2', textAlign: 'center', fontFamily: 'system-ui, sans-serif'}}>
          <div style={{fontSize: 48, marginBottom: 12}}>⚠️</div>
          <h2 style={{fontSize: 22, margin: '0 0 10px', color: '#14172B'}}>Something went wrong</h2>
          <p style={{color: '#6B7190', fontSize: 14, marginBottom: 20}}>
            {this.state.error?.message || 'An unexpected error occurred while rendering the page.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{background: '#3D5AFE', color: '#fff', border: 0, padding: '10px 20px', borderRadius: 10, fontWeight: 700, cursor: 'pointer'}}
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
