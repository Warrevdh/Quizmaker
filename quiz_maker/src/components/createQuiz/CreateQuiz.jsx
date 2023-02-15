import "./CreateQuiz.scss";
import CreateQuizHeader from "./CreateQuizHeader";
import CreateQuizForm from "./CreateQuizForm";
export default function createQuiz() {
  return (
    <div className="quiz-container">
      <CreateQuizHeader />
      <CreateQuizForm />
    </div>
  );
}
