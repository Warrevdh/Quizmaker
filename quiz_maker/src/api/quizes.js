import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

const baseUrl = `${process.env.REACT_APP_API_URL}/quizes`;

const useQuizes = () => {
  const { getAccessTokenSilently } = useAuth0();

  // Get all quizes
  const getAll = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const { data } = await axios.get(`${baseUrl}`, {
      params: {
        limit: 25,
        offset: 0,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  }, [getAccessTokenSilently]);

  // Get all quizes by user id
  const getFromUser = useCallback(
    async (userId) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.get(`${baseUrl}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    [getAccessTokenSilently]
  );

  // Get quiz by id
  const getById = useCallback(
    async (id) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.get(`${baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    [getAccessTokenSilently]
  );

  // Delete quiz by id
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

  // Update quiz
  const updateQuiz = async (id, name, description, category) => {
    const { data } = await axios.put(`${baseUrl}/${id}`, {
      description,
      category,
      name,
    });
    return data;
  };

  // Create quiz
  const createQuiz = useCallback(
    async ({ id, description, category, name, user_id }) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.post(
        `${baseUrl}`,
        {
          id,
          description,
          category,
          name,
          user_id,
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

  return {
    getAll,
    getFromUser,
    getById,
    deleteById,
    updateQuiz,
    createQuiz,
  };
};

export default useQuizes;
