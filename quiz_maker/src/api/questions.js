import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useCallback } from "react";

const baseUrl = `${process.env.REACT_APP_API_URL}/questions`;

const useQuestions = () => {
  const { getAccessTokenSilently } = useAuth0();

  // Get question by id
  const getById = useCallback(
    async (id) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.get(`${baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.data;
    },
    [getAccessTokenSilently]
  );

  // Get all questions by quiz id
  const getAllByQuizId = useCallback(
    async (quizId) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.get(`${baseUrl}/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    [getAccessTokenSilently]
  );

  // Update question
  const updateQuestion = useCallback(
    async (id, question, answer, choice1, choice2, choice3) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.put(
        `${baseUrl}/${id}`,
        {
          question,
          answer,
          choice1,
          choice2,
          choice3,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.data;
    },
    [getAccessTokenSilently]
  );

  // Create question
  const createQuestion = useCallback(
    async ({ id, question, answer, choice1, choice2, choice3, quiz_id }) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.post(
        `${baseUrl}`,
        {
          id,
          question,
          answer,
          choice1,
          choice2,
          choice3,
          quiz_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.data;
    },
    [getAccessTokenSilently]
  );

  // Delete all questions by quiz id
  const deleteByQuizId = useCallback(
    async (quizId) => {
      const token = await getAccessTokenSilently();
      await axios.delete(`${baseUrl}/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [getAccessTokenSilently]
  );

  // Delete question by id
  const deleteById = useCallback(
    async (id) => {
      const token = await getAccessTokenSilently();
      await axios.delete(`${baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [getAccessTokenSilently]
  );

  return {
    getById,
    getAllByQuizId,
    updateQuestion,
    createQuestion,
    deleteByQuizId,
    deleteById,
  };
};

export default useQuestions;
