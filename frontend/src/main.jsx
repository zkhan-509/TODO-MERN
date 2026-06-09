import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#fdfcf7', color: '#2d2820', border: '1.5px solid #e8dfc4', borderRadius: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14 },
          success: { iconTheme: { primary: '#3a6140', secondary: '#fdfcf7' } },
          error: { iconTheme: { primary: '#c0735a', secondary: '#fdfcf7' } },
        }} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
