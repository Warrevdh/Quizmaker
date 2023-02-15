import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { Button } from "react-bootstrap";

function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = useCallback(async () => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return (
    <Button className="btn btn-primary" onClick={handleLogin}>
      Log in
    </Button>
  );
}

export default LoginButton;
