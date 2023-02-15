import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import useQuizes from "../../api/quizes";
import useQuestions from "../../api/questions";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useCallback } from "react";
import Error from "../Error";
import Loader from "../Loader";

export function QuizInputs({ name, description, category, loading, error }) {
  return (
    <>
      <Form.Control
        data-cy="quizNameInput"
        required
        type="text"
        name="name"
        id="quizName"
        className="mb-3"
        placeholder="Naam van jouw quiz"
        defaultValue={name}
        disabled={loading || error}
      />
      <Form.Control
        data-cy="quizDescriptionInput"
        required
        type="text"
        name="description"
        id="quizDescription"
        className="mb-3"
        placeholder="Beschrijving van jouw quiz"
        defaultValue={description}
        disabled={loading || error}
      />
      <Form.Select
        data-cy="quizCategorySelect"
        required
        id="quizCategory"
        className="mb-3"
        defaultValue={category}
        disabled={loading || error}
      >
        <option>Videospellen</option>
        <option>Multimedia</option>
        <option>Geografie</option>
        <option>Wiskunde</option>
        <option>Technologie</option>
        <option>Politiek</option>
        <option>Wetenschap</option>
        <option>Gezondheid</option>
        <option>Overige</option>
      </Form.Select>
    </>
  );
}

export function QuestionInputs({
  question,
  answer1,
  answer2,
  answer3,
  answer4,
  index,
  loading,
  error,
}) {
  // remove question
  const handleRemoveClick = (index) => {
    document.getElementById(index).remove();
  };

  return (
    <>
      <div className="question p-3 border border-dark rounded mb-2" id={index}>
        <input
          data-cy="questionInput"
          id={index + "question"}
          required
          className="col-11"
          type="text"
          name="question"
          placeholder="Vraag"
          defaultValue={question}
          disabled={loading || error}
        />
        <input
          data-cy="answerInput"
          id={index + "answer1"}
          required
          className="col-lg-2 col-11 m-auto mt-3"
          type="text"
          name="answer"
          placeholder="Antwoord"
          defaultValue={answer1}
          disabled={loading || error}
        />
        <input
          data-cy="choice1Input"
          id={index + "answer2"}
          required
          className="col-lg-2 col-11 m-auto mt-3"
          type="text"
          name="choice1"
          placeholder="keuze 2"
          defaultValue={answer2}
          disabled={loading || error}
        />
        <input
          data-cy="choice2Input"
          id={index + "answer3"}
          className="col-lg-2 col-11 m-auto mt-3"
          type="text"
          name="choice2"
          placeholder="keuze 3"
          defaultValue={answer3}
          disabled={loading || error}
        />
        <input
          data-cy="choice3Input"
          id={index + "answer4"}
          className="col-lg-2 col-11 m-auto mt-3"
          type="text"
          name="choice3"
          placeholder="keuze 4"
          defaultValue={answer4}
          disabled={loading || error}
        />
        <div className="m-2">
          <Button
            variant="danger"
            className="add-remove me-2"
            onClick={() => handleRemoveClick(index)}
            disabled={loading || error}
            hidden={index === 0}
          >
            <strong>-</strong>
          </Button>
        </div>
      </div>
    </>
  );
}

export function QuestionList({ questions, loading, error }) {
  return (
    <>
      {questions.map((question, index) => (
        <QuestionInputs
          key={question.id}
          question={question.question}
          answer1={question.answer}
          answer2={question.choice1}
          answer3={question.choice2}
          answer4={question.choice3}
          index={index}
          loading={loading}
          error={error}
        />
      ))}
    </>
  );
}

export default function EditQuizForm() {
  const questionAPI = useQuestions();
  const quizAPI = useQuizes();
  const [quiz, setQuizData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [showNewQuestion, setshowNewQuestion] = useState(false);
  const handleCloseModal = () => setshowModal(false);
  const handleShowModal = () => setshowModal(true);
  const { id } = useParams();

  // fetch quiz data
  const fetchQuizData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizAPI.getById(id);
      setQuizData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch questions from quiz
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionAPI.getAllByQuizId(id);
      setQuestions(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // create new question
  const createNewQuestion = async (question) => {
    await questionAPI.createQuestion(question);
  };

  const [inputList, setInputList] = useState([
    {
      question: "",
      answer: "",
      choice1: "",
      choice2: "",
      choice3: "",
    },
  ]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([
      ...inputList,
      {
        question: "",
        answer: "",
        choice1: "",
        choice2: "",
        choice3: "",
      },
    ]);
  };

  // show new question form
  const handleNewQuestion = (e) => {
    setshowNewQuestion(true);
  };

  // remove new question form
  const handleRemoveNewQuestion = (e) => {
    setInputList([
      {
        question: "",
        answer: "",
        choice1: "",
        choice2: "",
        choice3: "",
      },
    ]);
    setshowNewQuestion(false);
  };

  useEffect(() => {
    fetchQuestions();
    fetchQuizData();
  }, [fetchQuizData, fetchQuestions]);

  // update quiz and questions with new data
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      handleShowModal();
      setLoading(true);
      quizAPI.updateQuiz(
        quiz.id,
        document.getElementById("quizName").value,
        document.getElementById("quizDescription").value,
        document.getElementById("quizCategory").value
      );

      questions.forEach((question, index) => {
        if (document.getElementById(index)) {
          questionAPI.updateQuestion(
            question.id,
            document.getElementById(index + "question").value,
            document.getElementById(index + "answer1").value,
            document.getElementById(index + "answer2").value,
            document.getElementById(index + "answer3").value,
            document.getElementById(index + "answer4").value
          );
        } else {
          questionAPI.deleteById(question.id);
        }
      });

      if (inputList[0].question !== "") {
        inputList.forEach((input) => {
          createNewQuestion({
            question: input.question,
            answer: input.answer,
            choice1: input.choice1,
            choice2: input.choice2,
            choice3: input.choice3,
            quiz_id: id,
          });
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Bevestiging</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Error error={error} />
          <Loader loading={loading} />
          {!loading && !error ? <>Uw quiz is aangepast!</> : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={loading}
            id="modalOkBtn"
            data-cy="modalOkBtn"
            variant="success"
            onClick={() => {
              handleCloseModal();
            }}
          >
            ok
          </Button>
        </Modal.Footer>
      </Modal>
      <Form onSubmit={handleSubmit}>
        <QuizInputs
          name={quiz.name}
          description={quiz.description}
          category={quiz.category}
          loading={loading}
          error={error}
        />
        <QuestionList questions={questions} loading={loading} error={error} />
        <div id="newQuestions" hidden={!showNewQuestion}>
          {inputList.map((x, i) => {
            return (
              <div
                key={i}
                className="question p-3 border border-dark rounded mb-2"
              >
                <input
                  required={showNewQuestion}
                  className="col-11"
                  type="text"
                  name="question"
                  placeholder="Vraag"
                  value={x.question}
                  onChange={(e) => handleInputChange(e, i)}
                  disabled={loading || error}
                />
                <input
                  required={showNewQuestion}
                  className="col-lg-2 col-11 m-auto mt-3"
                  type="text"
                  name="answer"
                  placeholder="Antwoord"
                  value={x.answer}
                  onChange={(e) => handleInputChange(e, i)}
                  disabled={loading || error}
                />
                <input
                  required={showNewQuestion}
                  className="col-lg-2 col-11 m-auto mt-3"
                  type="text"
                  name="choice1"
                  placeholder="keuze 2"
                  value={x.choice1}
                  onChange={(e) => handleInputChange(e, i)}
                  disabled={loading || error}
                />
                <input
                  className="col-lg-2 col-11 m-auto mt-3"
                  type="text"
                  name="choice2"
                  placeholder="keuze 3"
                  value={x.choice2}
                  onChange={(e) => handleInputChange(e, i)}
                  disabled={loading || error}
                />
                <input
                  className="col-lg-2 col-11 m-auto mt-3"
                  type="text"
                  name="choice3"
                  placeholder="keuze 4"
                  value={x.choice3}
                  onChange={(e) => handleInputChange(e, i)}
                  disabled={loading || error}
                />
                <div className="m-2">
                  {inputList.length - 1 === i && (
                    <Button
                      variant="success"
                      className="add-remove me-2"
                      onClick={handleAddClick}
                      disabled={loading || error}
                    >
                      <strong>+</strong>
                    </Button>
                  )}
                  {inputList.length !== 1 && (
                    <Button
                      variant="danger"
                      className="add-remove me-2"
                      onClick={() => handleRemoveClick(i)}
                      disabled={loading || error}
                    >
                      <strong>-</strong>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mb-2">
          <Button
            id="newQuestionButton"
            variant="success"
            hidden={showNewQuestion}
            className="add-remove me-2"
            onClick={handleNewQuestion}
            disabled={loading || error}
          >
            <strong>+</strong>
          </Button>
          <Button
            id="newQuestionRemoveButton"
            variant="danger"
            className="add-remove me-2"
            onClick={handleRemoveNewQuestion}
            disabled={loading || error}
            hidden={!showNewQuestion}
          >
            <strong>-</strong>
          </Button>
        </div>
        <Button
          data-cy="submit"
          variant="primary"
          className="mb-5"
          type="submit"
          disabled={loading || error}
        >
          Opslaan
        </Button>
      </Form>
    </>
  );
}
