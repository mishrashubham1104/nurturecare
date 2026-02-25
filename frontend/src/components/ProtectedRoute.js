
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isLoggedIn) {
    // Redirect to login, remembering where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
