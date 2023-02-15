export default function Loader({ loading }) {
  if (loading) {
    return (
      <div
        className="row d-flex justify-content-center align-items-center"
        style={{ height: "100" }}
      >
        <div className="spinner-border" data-cy="loading">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ textAlign: "center" }}>Loading...</p>
      </div>
    );
  }

  return null;
}
