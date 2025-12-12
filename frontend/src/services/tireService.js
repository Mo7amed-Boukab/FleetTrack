import axios from "../axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const tireService = {
  getAllTires: async (status = null, condition = null) => {
    let url = "/tires";
    const params = new URLSearchParams();

    if (status) params.append("status", status);
    if (condition) params.append("condition", condition);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await axios.get(url, getAuthHeaders());
    return response.data;
  },

  getTireById: async (id) => {
    const response = await axios.get(`/tires/${id}`, getAuthHeaders());
    return response.data;
  },

  createTire: async (tireData) => {
    const response = await axios.post("/tires", tireData, getAuthHeaders());
    return response.data;
  },

  updateTire: async (id, tireData) => {
    const response = await axios.put(
      `/tires/${id}`,
      tireData,
      getAuthHeaders()
    );
    return response.data;
  },

  deleteTire: async (id) => {
    const response = await axios.delete(`/tires/${id}`, getAuthHeaders());
    return response.data;
  },

  assignTire: async (id, assignmentData) => {
    const response = await axios.put(
      `/tires/${id}/assign`,
      assignmentData,
      getAuthHeaders()
    );
    return response.data;
  },

  unassignTire: async (id) => {
    const response = await axios.put(
      `/tires/${id}/unassign`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },
};

export default tireService;
