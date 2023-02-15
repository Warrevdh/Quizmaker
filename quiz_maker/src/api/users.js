import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

const baseUrl = `${process.env.REACT_APP_API_URL}/users`;

const useUsers = () => {
  const { getAccessTokenSilently } = useAuth0();

  // Get user by auth0id
  const getByAuth0Id = useCallback(
    async (auth0Id) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.get(`${baseUrl}/auth0id/${auth0Id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    [getAccessTokenSilently]
  );

  // returns true if user is admin
  const checkIfAdmin = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const { data } = await axios.get(`${baseUrl}/role/check`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data === "ADMIN") return true;
    else return false;
  }, [getAccessTokenSilently]);

  // Update user
  const updateUser = useCallback(
    async (email, username) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.post(
        `${baseUrl}`,
        {
          email,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    },
    [getAccessTokenSilently]
  );

  // Get all users
  const getAllUsers = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const { data } = await axios.get(`${baseUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.data;
  }, [getAccessTokenSilently]);

  // Get user by id
  const getByUserId = useCallback(
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

  // Update user role
  const updateRole = useCallback(
    async (id, role) => {
      const token = await getAccessTokenSilently();
      const { data } = await axios.put(
        `${baseUrl}/role/${id}`,
        {
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    },
    [getAccessTokenSilently]
  );

  return {
    getByAuth0Id,
    checkIfAdmin,
    updateUser,
    getAllUsers,
    getByUserId,
    updateRole,
  };
};

export default useUsers;
