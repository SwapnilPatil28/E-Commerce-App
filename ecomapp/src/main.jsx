import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Mounts the React application into the DOM element with id 'root'
createRoot(document.getElementById('root')).render(
    <App />
)
