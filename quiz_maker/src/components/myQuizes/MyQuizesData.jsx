import { useState, useCallback, useEffect } from "react";
import Error from "../Error";
import Loader from "../Loader";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import useQuizes from "../../api/quizes.js";
import useQuestions from "../../api/questions.js";
import { useAuth0 } from "@auth0/auth0-react";
import useUsers from "../../api/users";

export function QuizCard({
  id,
  name,
  description,
  category,
  createdAt,
  onDelete,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  createdAt = new Date(
    createdAt.substr(0, createdAt.indexOf("T"))
  ).toLocaleDateString("nl-NL");

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bevestiging</Modal.Title>
        </Modal.Header>
        <Modal.Body>Weet u zeker dat u deze quiz wil verwijderen?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuleer
          </Button>
          <Button
            data-cy="confirmDeleteQuiz"
            variant="danger"
            onClick={() => {
              handleDelete();
              handleClose();
            }}
          >
            Bevestig
          </Button>
        </Modal.Footer>
      </Modal>
      <div data-cy="quizCard" className="card col-lg-3 m-2">
        <div className="card-body">
          <h5 data-cy="quizTitle" className="card-title">
            {name}
          </h5>
          <h6 data-cy="quizCategory" className="card-subtitle mb-2 text-muted">
            {category}
          </h6>
          <p data-cy="quizDescription" className="card-text">
            {description}
          </p>
          <div className="d-flex justify-content-end">
            <Link to={`/quiz/edit/${id}`}>
              <Button data-cy="editQuizBtn" className="btn btn-primary mx-1">
                edit
              </Button>
            </Link>
            <Button data-cy="quizDelete" variant="danger" onClick={handleShow}>
              Delete
            </Button>
          </div>
        </div>
        <div data-cy="quizFooter" className="card-footer text-muted">
          {createdAt}
        </div>
      </div>
    </>
  );
}

export function QuizList({ quizes, onDelete }) {
  return (
    <>
      {quizes.map((data) => (
        <QuizCard key={data.id} {...data} onDelete={onDelete} />
      ))}
    </>
  );
}

export default function Quiz() {
  const userAPI = useUsers();
  const questionAPI = useQuestions();
  const quizAPI = useQuizes();
  const [quizes, setQuizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth0();

  // Fetch quizes from API
  const fetchQuizes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dataUser = await userAPI.getByAuth0Id(user.sub);
      const data = await quizAPI.getFromUser(dataUser.id);
      setQuizes(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizes();
  }, [fetchQuizes]);

  // Delete quiz
  const handleDelete = useCallback(async (idToDelete) => {
    try {
      setError(null);
      await questionAPI.deleteByQuizId(idToDelete);
      await quizAPI.deleteById(idToDelete);
      setQuizes((quizes) => quizes.filter(({ id }) => id !== idToDelete));
    } catch (error) {
      setError(error);
    }
  }, []);

  return (
    <div className="container-fluid py-2">
      <div className="row">
        <Loader loading={loading} />
        <Error error={error} />
        {!loading && !error ? (
          <QuizList quizes={quizes} onDelete={handleDelete} />
        ) : null}
      </div>
    </div>
  );
}
