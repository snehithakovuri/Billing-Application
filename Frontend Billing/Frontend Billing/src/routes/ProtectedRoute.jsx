import { Navigate } from "react-router-dom";
import AccessDenied from "../components/AccessDenied";

const ProtectedRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <AccessDenied />;
  }

  return children;
};

export default ProtectedRoute;
