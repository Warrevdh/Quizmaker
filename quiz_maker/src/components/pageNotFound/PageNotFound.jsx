import "./PageNotFound.scss";
export default function PageNotFound() {
  return (
    <div className="d-flex justify-content-center align-items-center error">
      <p className="error-text">
        404 <br /> <span className="span-error">Page Not Found</span>
      </p>
    </div>
  );
}
