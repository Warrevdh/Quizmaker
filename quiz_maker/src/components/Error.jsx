import { Alert } from "react-bootstrap";

export default function Error({ error }) {
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Er is iets fout gegaan</Alert.Heading>
        {error.message || JSON.stringify(error)}
        <hr />
        <p className="mb-0">
          Contacteer mij op{" "}
          <a
            href="https://discordapp.com/users/337521371414396928"
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>{" "}
          als dit niet mocht gebeuren.
        </p>
      </Alert>
    );
  }

  return null;
}
