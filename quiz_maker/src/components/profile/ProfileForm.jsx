import { useAuth0 } from "@auth0/auth0-react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function ProfileForm() {
  const email = useAuth0().user.email;
  const nickname = useAuth0().user.nickname;
  const emailVerified = useAuth0().user.email_verified;

  return (
    <>
      <div className="profile_form">
        <Form className="row justify-content-center">
          <div className="mb-3 col-12 col-lg-7">
            <Form.Label htmlFor="emailInput" className="form-label">
              Email:
            </Form.Label>
            <InputGroup>
              <Form.Control
                value={email}
                type="email"
                className="form-control"
                id="emailInput"
                aria-describedby="check_verified"
                disabled
              />
              <InputGroup.Text
                className="check_verified_container"
                id="check_verified"
              >
                {emailVerified ? (
                  <svg
                    className="checkmark"
                    width="248"
                    height="248"
                    viewBox="0 0 248 248"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M227.333 114.493V124C227.321 146.283 220.105 167.965 206.763 185.812C193.421 203.659 174.667 216.716 153.299 223.034C131.93 229.352 109.092 228.593 88.1895 220.871C67.2873 213.148 49.4414 198.876 37.3132 180.183C25.185 161.49 19.4245 139.377 20.8906 117.142C22.3568 94.9072 30.9711 73.7421 45.4488 56.8031C59.9266 39.8642 79.4921 28.059 101.227 23.1482C122.962 18.2374 145.703 20.4842 166.057 29.5534"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M227.333 41.3334L124 144.77L93 113.77"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    className="cross"
                    width="102"
                    height="102"
                    viewBox="0 0 102 102"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M51 93.5C74.4721 93.5 93.5 74.4721 93.5 51C93.5 27.5279 74.4721 8.5 51 8.5C27.5279 8.5 8.5 27.5279 8.5 51C8.5 74.4721 27.5279 93.5 51 93.5Z"
                      stroke="black"
                      strokeWidth="2"
                      strokelinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M63.75 38.25L38.25 63.75"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M38.25 38.25L63.75 63.75"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div className="mb-3 col-12 col-lg-7">
            <Form.Label htmlFor="nickNameInput" className="form-label">
              Nickname:
            </Form.Label>
            <div className="input-group">
              <Form.Control
                value={nickname}
                type="text"
                className="form-control"
                id="nickNameInput"
                aria-describedby="button-addon2"
                disabled
              />
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
