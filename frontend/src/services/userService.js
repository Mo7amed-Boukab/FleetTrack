import axios from "../axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const userService = {
  getAllUsers: async (role = null) => {
    const response = await axios.get("/users", getAuthHeaders());
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axios.get(`/users/${id}`, getAuthHeaders());
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axios.post("/users", userData, getAuthHeaders());
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axios.put(`/users/${id}`, userData, getAuthHeaders());
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`/users/${id}`, getAuthHeaders());
    return response.data;
  },
};

export default userService;
