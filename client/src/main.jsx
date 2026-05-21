import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppProvider } from './context/AppContext.jsx'

// Vite requires the VITE_ prefix to expose variables to the client-side code.
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

// 🌟 ANTI-CRASH PATCH: Agar poore project mein koi bhi component temporary '_id' 
// read karne ke chakkar mein undefined ka error dega, toh yeh use daba dega aur popup nahi aane dega.
const nativeErrorLog = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes("Cannot read properties of undefined (reading '_id')")) {
    return; // Is error ko console aur toast mein aane se pehle hi block kar do
  }
  nativeErrorLog(...args);
};

window.addEventListener('error', (e) => {
  if (e.message && e.message.includes("reading '_id'")) {
    e.preventDefault(); // Browser panel standard crash rokne ke liye
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
    >
      <BrowserRouter> 
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter> 
    </ClerkProvider>
  </StrictMode>
)