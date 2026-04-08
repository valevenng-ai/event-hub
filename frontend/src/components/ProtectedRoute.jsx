import { Navigate } from 'react-router-dom';
import { isAuthed } from '../store/authStore';

function ProtectedRoute({ children }) {
  if (!isAuthed()) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;