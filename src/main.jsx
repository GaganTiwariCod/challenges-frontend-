import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
import {Store} from './store'
import {ErrorBoundary} from './components/ErrorBoundary'
import './index.css'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <Store>
            <App />
          </Store>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
