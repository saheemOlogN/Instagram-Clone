import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({children}) => {
    const {user} = useSelector(store=>store.auth)

    if (!user) return <Navigate to="/signin" replace />

  return (
    children
  )
}

export default ProtectedRoutes
