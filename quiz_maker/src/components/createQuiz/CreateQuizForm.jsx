import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useAuth0 } from "@auth0/auth0-react";
import useQuizes from "../../api/quizes";
import useQuestions from "../../api/questions";
import useUsers from "../../api/users";
import Loader from "../Loader";
import Error from "../Error";

export default function CreateQuizForm() {
  const { user } = useAuth0();
  const questionAPI = useQuestions();
  const quizAPI = useQuizes();
  const userAPI = useUsers();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const handleCloseModal = () => setshowModal(false);
  const handleShowModal = () => setshowModal(true);

  // get user data
  const getUserData = async () => {
    const userData = await userAPI.getByAuth0Id(user.sub);
    return userData;
  };

  // create new quiz
  const createNewQuiz = async (quiz) => {
    await quizAPI.createQuiz(quiz);
  };

  // create new question
  const createNewQuestion = async (question) => {
    await questionAPI.createQuestion(question);
  };

  // update user
  const updateUser = async (email, username) => {
    await userAPI.updateUser(email, username);
  };

  // create new quiz and questions with form data
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      handleShowModal();
      setLoading(true);
      await updateUser(user.email, user.nickname);
      const userData = await getUserData();
      const quizId = uuidv4();
      await createNewQuiz({
        id: quizId,
        name: e.target.elements.quizName.value,
        description: e.target.elements.quizDescription.value,
        category: e.target.elements.category.value,
        user_id: userData.id,
      });
      inputList.forEach(async (input) => {
        if (input.question !== "") {
          await createNewQuestion({
            question: input.question,
            answer: input.answer,
            choice1: input.choice1,
            choice2: input.choice2,
            choice3: input.choice3,
            quiz_id: quizId,
          });
        }
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
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

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Bevestiging</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Error error={error} />
          <Loader loading={loading} />
          {!loading && !error ? <>Uw quiz is aangemaakt!</> : null}
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
        <Form.Control
          data-cy="quizNameInput"
          required
          type="text"
          id="quizName"
          className="mb-3"
          placeholder="Naam van jouw quiz"
          disabled={loading || error}
        />
        <Form.Control
          data-cy="quizDescriptionInput"
          required
          type="text"
          id="quizDescription"
          className="mb-3"
          placeholder="Beschrijving van jouw quiz"
          disabled={loading || error}
        />
        <Form.Select
          data-cy="quizCategorySelect"
          required
          id="category"
          className="mb-3"
          defaultValue="Selecteer een categorie"
          disabled={loading || error}
        >
          <option hidden>Selecteer een categorie</option>
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
        {inputList.map((x, i) => {
          return (
            <div
              className="question p-3 border border-dark rounded mb-2"
              key={i}
            >
              <input
                data-cy="questionInput"
                required
                id={i * 10}
                className="col-11"
                type="text"
                name="question"
                placeholder="Vraag"
                value={x.question}
                onChange={(e) => handleInputChange(e, i)}
                disabled={loading || error}
              />
              <input
                data-cy="answerInput"
                required
                id={i * 10 + 1}
                className="col-lg-2 col-11 m-auto mt-3"
                type="text"
                name="answer"
                placeholder="Antwoord"
                value={x.answer}
                onChange={(e) => handleInputChange(e, i)}
                disabled={loading || error}
              />
              <input
                data-cy="choice1Input"
                required
                id={i * 10 + 2}
                className="col-lg-2 col-11 m-auto mt-3"
                type="text"
                name="choice1"
                placeholder="keuze 2"
                value={x.choice1}
                onChange={(e) => handleInputChange(e, i)}
                disabled={loading || error}
              />
              <input
                data-cy="choice2Input"
                id={i * 10 + 3}
                className="col-lg-2 col-11 m-auto mt-3"
                type="text"
                name="choice2"
                placeholder="keuze 3"
                value={x.choice2}
                onChange={(e) => handleInputChange(e, i)}
                disabled={loading || error}
              />
              <input
                data-cy="choice3Input"
                id={i * 10 + 4}
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
