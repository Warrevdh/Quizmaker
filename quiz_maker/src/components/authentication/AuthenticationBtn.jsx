import { useAuth0 } from "@auth0/auth0-react";
import LoginBtn from "./LoginBtn";
import LogoutBtn from "./LogoutBtn";

export default function AuthenticationBtn() {
  const { isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return <LogoutBtn />;
  }

  return <LoginBtn />;
}
