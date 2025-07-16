import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(UserContext);

  if (!user || !roles.includes(user.role)) {
    alert('You are not authorized')
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
