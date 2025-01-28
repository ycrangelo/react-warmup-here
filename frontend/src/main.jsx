import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MetaMaskProvider } from "@metamask/sdk-react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: "Example React Dapp",
          url: window.location.href,
        },
        infuraAPIKey:"761d4f68747e492c8ed3cfa02ab60f1c",
        // Other options.
      }}
    >
      <App />
    </MetaMaskProvider>
  </StrictMode>,
)
