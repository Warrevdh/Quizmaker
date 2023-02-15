import { Link } from "react-router-dom";
export default function PlayQUIZbtn() {
  return (
    <div className="PlayQUIZbtn">
      <Link to="/comingsoon">
        <button className="button">Speel een QUIZ</button>
      </Link>
    </div>
  );
}
