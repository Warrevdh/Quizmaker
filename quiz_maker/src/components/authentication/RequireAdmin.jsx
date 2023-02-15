import { Navigate } from "react-router";
import useUsers from "../../api/users";
import Loader from "../Loader";
import { useEffect, useState } from "react";

export default function RequireAdmin({ children }) {
  const userAPI = useUsers();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (await userAPI.checkIfAdmin()) {
        setIsAdmin(true);
      }
      setIsLoading(false);
    };
    checkAdmin();
  });

  // wait until admin status is known
  if (isLoading) {
    return <Loader loading />;
  }

  // if not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // if admin, show admin page
  return children;
}
