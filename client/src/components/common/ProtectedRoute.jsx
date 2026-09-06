import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Invalid stored user:",
      error
    );
  }

  // If this route requires specific roles
  if (allowedRoles) {
    if (
      !user ||
      !allowedRoles.includes(user.role)
    ) {
      // Send user to the correct dashboard
      if (user?.role === "admin") {
        return (
          <Navigate
            to="/admin-dashboard"
            replace
          />
        );
      }

      if (user?.role === "recruiter") {
        return (
          <Navigate
            to="/recruiter-dashboard"
            replace
          />
        );
      }

      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }
  }

  return children;
}

export default ProtectedRoute;