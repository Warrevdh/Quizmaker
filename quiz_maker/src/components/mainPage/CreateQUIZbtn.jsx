import { Link } from "react-router-dom";
export default function CreateQUIZbtn() {
  return (
    <div className="CreateQUIZbtn">
      <Link to="/quiz/create">
        <button className="button">Maak jouw QUIZ</button>
      </Link>
    </div>
  );
}
