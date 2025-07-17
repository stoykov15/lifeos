import { Navigate } from "react-router-dom";
import { getUser } from "./user";

export default function ProtectedRoute({ children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/setup" replace />;
  }

  return children;
}
