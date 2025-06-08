import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'
import Router from './Router.tsx'
import { SearchProvider } from './context/SearchContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SearchProvider>
        <Router />
      </SearchProvider>
    </AuthProvider>
  </StrictMode>
)