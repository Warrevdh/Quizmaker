import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

function LogoutButton() {
  const { logout } = useAuth0();
  return (
    <Button
      data-cy="logoutBtn"
      type="button"
      className="btn btn-danger"
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
    >
      Log out
    </Button>
  );
}

export default LogoutButton;
