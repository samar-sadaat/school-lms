import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster position="top-right" autoClose={2000} toastOptions={{
      success: {
        className: "toast-success",
      },
      error: {
        className: "toast-error",
      },
      style: {
        width: "250px",
        height: "80px",
        fontSize: "18px",
      },
    }} />
  </>
)
