import "./EditQuiz.scss";
import EditQuizHeader from "./EditQuizHeader";
import EditQuizForm from "./EditQuizForm";
export default function createQuiz() {
  return (
    <div className="quiz-container">
      <EditQuizHeader />
      <EditQuizForm />
    </div>
  );
}
