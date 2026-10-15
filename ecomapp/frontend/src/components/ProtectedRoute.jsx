import { Navigate,Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { customer, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="py-24 text-center font-black uppercase">Checking your account...</div>
  }

  return customer ? <Outlet/> : <Navigate to="/login" replace state={{ from: location }} />
}

export default ProtectedRoute
