import { UserManagementPage } from './Pages';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ...existing code...

<Router>
  <Routes>
    {/* ...existing routes... */}
    <Route path="/user-management" element={<UserManagementPage />} />
  </Routes>
</Router>
import  React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
