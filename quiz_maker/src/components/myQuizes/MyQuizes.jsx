import "./MyQuizes.scss";
import MyQuizesHeader from "./MyQuizesHeader";
import MyQuizesData from "./MyQuizesData";
export default function MyQuizes() {
  return (
    <div className="quiz-container">
      <div className="container-fluid">
        <MyQuizesHeader />
        <MyQuizesData />
      </div>
    </div>
  );
}
