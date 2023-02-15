import React, { useState, useCallback, useEffect, useRef } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import useUsers from "../../api/users";
import useQuizes from "../../api/quizes";
import useQuestions from "../../api/questions";
import Loader from "../Loader";
import Error from "../Error";
import "react-bootstrap-typeahead/css/Typeahead.css";

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

  // set date to local date
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
      <div className="card col-12 col-lg-3 m-2">
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{category}</h6>
          <p className="card-text">{description}</p>
          <div className="d-flex justify-content-end">
            <Button variant="danger" onClick={handleShow}>
              Delete
            </Button>
          </div>
        </div>
        <div className="card-footer text-muted">{createdAt}</div>
      </div>
    </>
  );
}

export function QuizList({ quizes, onDelete }) {
  return (
    <>
      {quizes.map((data) => (
        <>
          <QuizCard key={data.id} {...data} onDelete={onDelete} />
        </>
      ))}
    </>
  );
}

export default function AdminPageContent() {
  const userAPI = useUsers();
  const questionAPI = useQuestions();
  const quizAPI = useQuizes();
  const [quizes, setQuizes] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const firstRender = useRef(true);
  const ref = React.createRef();

  // get all users on first render
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      const getAllUsers = async () => {
        const users = await userAPI.getAllUsers();
        users.forEach((user) => {
          const option = {
            id: user.id,
            label: `${user.email}`,
          };
          setOptions((options) => [...options, option]);
        });
      };
      getAllUsers().catch();
    }
  });

  // fill admin page with user info
  const handleChange = async () => {
    const optionId = options.find(
      (option) => option.label === ref.current.getInput().value
    ).id;
    const user = await userAPI.getByUserId(optionId);
    const createdAt = new Date(
      user.createdAt.substr(0, user.createdAt.indexOf("T"))
    ).toLocaleDateString("nl-NL");

    document.getElementById("emailInput").value = user.email;
    document.getElementById("roleInput").disabled = true;
    document.getElementById("EditRoleBtn").innerHTML = "Edit";
    document.getElementById(user.role).selected = true;
    document.getElementById("nickNameInput").value = user.username;
    document.getElementById(
      "accountAge"
    ).value = `Dit account is gemaakt op ${createdAt}.`;
    fetchQuizes(user.id);
  };

  // edit role
  const handleBtnClick = async (e) => {
    e.preventDefault();
    const roleInput = document.getElementById("roleInput");
    if (roleInput.disabled) {
      roleInput.disabled = false;
      e.target.innerHTML = "Save";
    } else {
      const optionId = options.find(
        (option) => option.label === ref.current.getInput().value
      ).id;
      await userAPI.updateRole(optionId, roleInput.value);
      roleInput.disabled = true;
      e.target.innerHTML = "Edit";
    }
  };

  // get all quizes from user
  const fetchQuizes = useCallback(async (id) => {
    if (id) {
      try {
        setLoading(true);
        setError(null);
        const data = await quizAPI.getFromUser(id);
        setQuizes(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // delete quiz from user
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
    <>
      <div className="adminpanel_form">
        <Form className="row justify-content-center">
          <div className="mb-3 col-12 col-lg-7">
            <InputGroup>
              <Typeahead
                id="UserSelect"
                options={options}
                placeholder="Selecteer een gebruiker"
                ref={ref}
              />
              <Button
                id="pickUserBtn"
                onClick={(e) => {
                  e.preventDefault();
                  handleChange(e);
                }}
                style={{ border: "none", backgroundColor: "transparent" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.62398 15C5.00872 16.3867 6.85275 17.2191 8.80868 17.3405C10.7646 17.4619 12.6974 16.8638 14.243 15.659L19.561 20.977C19.7496 21.1592 20.0022 21.2599 20.2644 21.2577C20.5266 21.2554 20.7774 21.1502 20.9628 20.9648C21.1482 20.7794 21.2534 20.5286 21.2557 20.2664C21.2579 20.0042 21.1571 19.7516 20.975 19.563L15.657 14.245C16.9153 12.6302 17.5102 10.5961 17.3204 8.55776C17.1305 6.51939 16.1703 4.63019 14.6355 3.27546C13.1006 1.92073 11.1068 1.20251 9.06065 1.26727C7.01448 1.33204 5.07007 2.17491 3.62398 3.624C2.87678 4.37082 2.28405 5.25754 1.87964 6.23351C1.47524 7.20948 1.26709 8.25556 1.26709 9.312C1.26709 10.3684 1.47524 11.4145 1.87964 12.3905C2.28405 13.3664 2.87678 14.2532 3.62398 15V15ZM5.03798 5.04C6.02656 4.05144 7.32731 3.43624 8.71861 3.29919C10.1099 3.16215 11.5057 3.51174 12.6681 4.28842C13.8306 5.06509 14.6878 6.22079 15.0937 7.55861C15.4996 8.89643 15.4291 10.3336 14.8941 11.6253C14.3592 12.9169 13.393 13.9831 12.1601 14.6423C10.9272 15.3014 9.50391 15.5127 8.13271 15.2401C6.7615 14.9675 5.52723 14.2279 4.64018 13.1473C3.75313 12.0668 3.26819 10.712 3.26798 9.314C3.26524 8.51957 3.42029 7.73251 3.72413 6.99848C4.02798 6.26445 4.47456 5.59806 5.03798 5.038V5.04Z"
                    fill="black"
                  />
                </svg>
              </Button>
            </InputGroup>
          </div>
          <div className="mb-3 col-12 col-lg-6">
            <Form.Label htmlFor="emailInput" className="form-label">
              Email:
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="email"
                className="form-control"
                id="emailInput"
                disabled
              />
            </InputGroup>
          </div>
          <div className="mb-3 col-12 col-lg-6">
            <Form.Label htmlFor="roleInput" className="form-label">
              Rol:
            </Form.Label>
            <InputGroup>
              <Form.Select
                type="text"
                className="form-control"
                id="roleInput"
                aria-describedby="EditRoleBtn"
                disabled
              >
                <option hidden></option>
                <option id="USER" value="USER">
                  User
                </option>
                <option id="ADMIN" value="ADMIN">
                  Admin
                </option>
              </Form.Select>
              <Button id="EditRoleBtn" onClick={handleBtnClick}>
                Edit
              </Button>
            </InputGroup>
          </div>
          <div className="mb-3 col-12 col-lg-6">
            <Form.Label htmlFor="nickNameInput" className="form-label">
              Nickname:
            </Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                className="form-control"
                id="nickNameInput"
                disabled
              />
            </div>
          </div>
          <div className="mb-3 col-12 col-lg-6">
            <Form.Label htmlFor="accountAge" className="form-label">
              Leeftijd account:
            </Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                className="form-control"
                id="accountAge"
                disabled
              />
            </div>
          </div>
        </Form>
      </div>
      <div className="container-fluid py-2 overflow-scroll quizContainer">
        <div className="row d-flex justify-content-center">
          <Loader loading={loading} />
          <Error error={error} />
          {!loading && !error ? (
            <QuizList key="quizList" quizes={quizes} onDelete={handleDelete} />
          ) : null}
        </div>
      </div>
    </>
  );
}
